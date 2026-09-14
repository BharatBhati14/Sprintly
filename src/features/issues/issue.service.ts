import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { issues, projectMembers, projects } from "@/db/schemas";
import type {
  CreateIssueInput,
  IssueListQuery,
  UpdateIssueInput,
} from "./issue.validation";
import { AuthorizationError } from "@/server/authorization/authorization-error";

// get issues
export async function getIssues(projectId: string, filters: IssueListQuery) {
  const conditions = [eq(issues.project_id, projectId)];

  if (filters.status) {
    conditions.push(eq(issues.status, filters.status));
  }

  if (filters.priority) {
    conditions.push(eq(issues.priority, filters.priority));
  }

  if (filters.assigneeId) {
    conditions.push(eq(issues.assignee_id, filters.assigneeId));
  }

  return await db
    .select()
    .from(issues)
    .where(and(...conditions))
    .orderBy(desc(issues.number));
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

  return issue ?? null;
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
