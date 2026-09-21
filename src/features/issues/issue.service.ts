import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  issueLabels,
  issues,
  labels,
  projectMembers,
  projects,
} from "@/db/schemas";
import type {
  CreateIssueInput,
  IssueListQuery,
  ReplaceIssueLabelsInput,
  UpdateIssueInput,
} from "./issue.validation";
import { AuthorizationError } from "@/server/authorization/authorization-error";

async function getLabelsForIssues(issueIds: string[]) {
  if (issueIds.length === 0) {
    return new Map<
      string,
      Array<{
        id: string;
        name: string;
        color: string | null;
      }>
    >();
  }

  const rows = await db
    .select({
      issueId: issueLabels.issue_id,
      id: labels.id,
      name: labels.name,
      color: labels.color,
    })
    .from(issueLabels)
    .innerJoin(labels, eq(issueLabels.label_id, labels.id))
    .where(inArray(issueLabels.issue_id, issueIds));

  const labelsByIssue = new Map<
    string,
    Array<{
      id: string;
      name: string;
      color: string | null;
    }>
  >();

  for (const row of rows) {
    const existing = labelsByIssue.get(row.issueId) ?? [];

    existing.push({
      id: row.id,
      name: row.name,
      color: row.color,
    });

    labelsByIssue.set(row.issueId, existing);
  }

  return labelsByIssue;
}

// get issues
export async function getIssues(
  organizationId: string,
  projectId: string,
  filters?: IssueListQuery,
) {
  const conditions = [eq(issues.project_id, projectId)];

  if (filters?.status) {
    conditions.push(eq(issues.status, filters.status));
  }

  if (filters?.priority) {
    conditions.push(eq(issues.priority, filters.priority));
  }

  if (filters?.assigneeId) {
    conditions.push(eq(issues.assignee_id, filters.assigneeId));
  }

  // If filtering by label, make sure the label belongs to the same organization as the project.
  if (filters?.labelId) {
    const [label] = await db
      .select({ id: labels.id })
      .from(labels)
      .where(
        and(eq(labels.id, filters.labelId), eq(labels.org_id, organizationId)),
      )
      .limit(1);

    if (!label) {
      return {
        data: [],
        pagination: {
          page: filters?.page ?? 1,
          limit: filters?.limit ?? 20,
          total: 0,
          totalPages: 0,
        },
      };
    }

    conditions.push(
      inArray(
        issues.id,
        db
          .select({ issueId: issueLabels.issue_id })
          .from(issueLabels)
          .where(eq(issueLabels.label_id, filters.labelId)),
      ),
    );
  }

  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 20;
  const offset = (page - 1) * limit;

  // Count total matching issues.
  const [countResult] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(issues)
    .where(and(...conditions));

  const total = Number(countResult?.count ?? 0);
  const totalPages = Math.ceil(total / limit);

  // Determine sorting.
  let orderBy;

  switch (filters?.sortBy) {
    case "updatedAt":
      orderBy =
        filters.sortOrder === "asc"
          ? asc(issues.updated_at)
          : desc(issues.updated_at);
      break;

    case "dueDate":
      orderBy =
        filters.sortOrder === "asc"
          ? asc(issues.due_date)
          : desc(issues.due_date);
      break;

    case "priority":
      orderBy =
        filters.sortOrder === "asc"
          ? asc(issues.priority)
          : desc(issues.priority);
      break;

    case "createdAt":
    default:
      orderBy =
        filters?.sortOrder === "asc"
          ? asc(issues.created_at)
          : desc(issues.created_at);
      break;
  }

  const issueRows = await db
    .select()
    .from(issues)
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  const labelsByIssue = await getLabelsForIssues(
    issueRows.map((issue) => issue.id),
  );

  const data = issueRows.map((issue) => ({
    ...issue,
    labels: labelsByIssue.get(issue.id) ?? [],
  }));

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

// ######## create issue #############
export async function createIssue(
  organizationId: string,
  projectId: string,
  reporterId: string,
  data: CreateIssueInput,
) {
  return await db.transaction(async (tx) => {
    const [currentProjectMember] = await tx
      .select()
      .from(projectMembers)
      .where(
        and(
          eq(projectMembers.project_id, projectId),
          eq(projectMembers.user_id, reporterId),
        ),
      )
      .limit(1);
    if (!currentProjectMember) {
      throw new AuthorizationError(
        "You do not have access to this project",
        403,
      );
    }

    // If an assignee was supplied, make sure the assignee belongs to this project
    if (data.assigneeId) {
      const [assigneeMembership] = await tx
        .select()
        .from(projectMembers)
        .where(
          and(
            eq(projectMembers.project_id, projectId),
            eq(projectMembers.user_id, data.assigneeId),
          ),
        )
        .limit(1);

      if (!assigneeMembership) {
        throw new AuthorizationError(
          "Assignee must be a member of this project",
          403,
        );
      }
    }

    /**
     * Allocate the next issue number.
     *
     * We lock the project row inside the transaction so
     * concurrent issue creation requests cannot obtain
     * the same number.
     *
     * This assumes PostgreSQL and that the project row
     * is lockable with FOR UPDATE.
     */
    const [lockedProject] = await tx
      .select()
      .from(projects)
      .where(
        and(eq(projects.id, projectId), eq(projects.org_id, organizationId)),
      )
      .for("update")
      .limit(1);

    if (!lockedProject) {
      throw new AuthorizationError("Project not found", 404);
    }

    /**
     * Find the highest existing issue number.
     *
     * Because the project row is locked, issue creation
     * through this service is serialized for this project.
     */
    // const [result] = await tx
    //   .select({
    //     maxNumber: sql<number>`coalesce(max(${issues.number}), 0)`,
    //   })
    //   .from(issues)
    //   .where(eq(issues.project_id, projectId));

    // const nextNumber = Number(result?.maxNumber ?? 0) + 1;

    const [lastIssue] = await tx
      .select({ number: issues.number })
      .from(issues)
      .where(eq(issues.project_id, projectId))
      .orderBy(desc(issues.number))
      .limit(1);

    const nextNumber = (lastIssue?.number ?? 0) + 1;

    // Create the issue
    const [issue] = await tx
      .insert(issues)
      .values({
        project_id: projectId,
        number: nextNumber,
        title: data.title,
        desc: data.description ?? null,
        status: data.status ?? "TODO",
        priority: data.priority ?? "MEDIUM",
        assignee_id: data.assigneeId ?? null,
        reporter_id: reporterId,
        due_date: data.dueDate ?? null,
      })
      .returning();

    if (!issue) {
      throw new Error("Failed to create issue");
    }

    return {
      issue,
      identifier: `${lockedProject.key}-${issue.number}`,
    };
  });
}

// ########### get individual issue #############

export async function getIssue(projectId: string, issueId: string) {
  const [issue] = await db
    .select()
    .from(issues)
    .where(and(eq(issues.id, issueId), eq(issues.project_id, projectId)))
    .limit(1);

  if (!issue) {
    return null;
  }

  const labelsByIssue = await getLabelsForIssues([issue.id]);

  return {
    ...issue,
    labels: labelsByIssue.get(issue.id) ?? [],
  };
}

// ############# update issue ################

export async function updateIssue(
  projectId: string,
  issueId: string,
  data: UpdateIssueInput,
) {
  return await db.transaction(async (tx) => {
    const [existingIssue] = await tx
      .select()
      .from(issues)
      .where(and(eq(issues.id, issueId), eq(issues.project_id, projectId)))
      .limit(1);

    if (!existingIssue) {
      throw new AuthorizationError("Issue Not Found", 404);
    }

    if (data.assigneeId) {
      const [assigneeMembership] = await tx
        .select()
        .from(projectMembers)
        .where(
          and(
            eq(projectMembers.project_id, projectId),
            eq(projectMembers.user_id, data.assigneeId),
          ),
        )
        .limit(1);

      if (!assigneeMembership) {
        throw new AuthorizationError(
          "Assignee must be a member of this project",
          403,
        );
      }
    }

    const updateData: Partial<typeof issues.$inferInsert> = {};

    if (data.title !== undefined) {
      updateData.title = data.title;
    }

    if (data.description !== undefined) {
      updateData.desc = data.description;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    if (data.priority !== undefined) {
      updateData.priority = data.priority;
    }

    if (data.assigneeId !== undefined && data.assigneeId !== null) {
      updateData.assignee_id = data.assigneeId;
    }

    if (data.dueDate !== undefined) {
      updateData.due_date = data.dueDate;
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error("No fields to update");
    }

    const [updatedIssue] = await tx
      .update(issues)
      .set({
        ...updateData,
        updated_at: new Date(),
      })
      .where(and(eq(issues.id, issueId), eq(issues.project_id, projectId)))
      .returning();

    if (!updatedIssue) {
      throw new Error("Failed to update issue");
    }

    return updatedIssue;
  });
}

// ############## replace issue labels ################

export async function replaceIssueLabels(
  organizationId: string,
  projectId: string,
  issueId: string,
  data: ReplaceIssueLabelsInput,
) {
  return await db.transaction(async (tx) => {
    const [issue] = await tx
      .select({
        id: issues.id,
      })
      .from(issues)
      .innerJoin(projects, eq(issues.project_id, projects.id))
      .where(
        and(
          eq(issues.id, issueId),
          eq(issues.project_id, projectId),
          eq(projects.id, projectId),
          eq(projects.org_id, organizationId),
        ),
      )
      .limit(1);

    if (!issue) {
      throw new AuthorizationError("Issue Not Found", 404);
    }

    if (data.labelIds.length > 0) {
      const organizationLabels = await tx
        .select({
          id: labels.id,
        })
        .from(labels)
        .where(
          and(
            eq(labels.org_id, organizationId),
            inArray(labels.id, data.labelIds),
          ),
        );

      if (organizationLabels.length !== data.labelIds.length) {
        throw new AuthorizationError(
          "One or more labels do not belong to this organization",
          403,
        );
      }
    }

    // Remove existing relationships
    await tx.delete(issueLabels).where(eq(issueLabels.issue_id, issueId));

    // Insert the new relationships
    if (data.labelIds.length > 0) {
      await tx.insert(issueLabels).values(
        data.labelIds.map((labelId) => ({
          issue_id: issueId,
          label_id: labelId,
        })),
      );
    }

    // Return the final domain representation
    const finalLabels =
      data.labelIds.length > 0
        ? await tx
            .select({
              id: labels.id,
              name: labels.name,
              color: labels.color,
            })
            .from(issueLabels)
            .innerJoin(labels, eq(issueLabels.label_id, labels.id))
            .where(eq(issueLabels.issue_id, issueId))
        : [];

    return finalLabels;
  });
}

// ################# delete issue ######################

export async function deleteIssue(projectId: string, issueId: string) {
  const [deletedIssue] = await db
    .delete(issues)
    .where(and(eq(issues.id, issueId), eq(issues.project_id, projectId)))
    .returning();

  if (!deletedIssue) {
    throw new AuthorizationError("Issue Not Found", 404);
  }

  return deletedIssue;
}
