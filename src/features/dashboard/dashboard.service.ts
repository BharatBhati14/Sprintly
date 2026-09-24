import { and, count, desc, eq, gte, inArray, lte, ne, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  issues,
  organization_members,
  organizations,
  projects,
} from "@/db/schemas";

export async function getDashboardData(userId: string) {
  const memberships = await db
    .select({
      organizationId: organization_members.organization_id,
    })
    .from(organization_members)
    .where(eq(organization_members.user_id, userId));

  const organizationIds = memberships.map(
    (membership) => membership.organizationId,
  );

  if (organizationIds.length === 0) {
    return {
      totals: {
        projects: 0,
        openIssues: 0,
        assignedToMe: 0,
        dueSoon: 0,
      },

      issueStatusCounts: {
        BACKLOG: 0,
        TODO: 0,
        IN_PROGRESS: 0,
        IN_REVIEW: 0,
        DONE: 0,
      },

      recentIssues: [],
      recentProjects: [],
    };
  }

  // Projects belonging to the user's organizations.

  const projectRows = await db
    .select({
      id: projects.id,
      organizationId: projects.org_id,
      organizationName: organizations.name,
      name: projects.name,
      key: projects.key,
      status: projects.status,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .innerJoin(organizations, eq(projects.org_id, organizations.id))
    .where(inArray(projects.org_id, organizationIds))
    .orderBy(desc(projects.createdAt))
    .limit(5);

  // Total project count.

  const [projectCount] = await db
    .select({
      count: count(),
    })
    .from(projects)
    .where(inArray(projects.org_id, organizationIds));

  const [openIssueCount] = await db
    .select({
      count: count(),
    })
    .from(issues)
    .innerJoin(projects, eq(issues.project_id, projects.id))
    .where(
      and(inArray(projects.org_id, organizationIds), ne(issues.status, "DONE")),
    );

  // Issues assigned to the current user.

  const [assignedIssueCount] = await db
    .select({
      count: count(),
    })
    .from(issues)
    .innerJoin(projects, eq(issues.project_id, projects.id))
    .where(
      and(
        inArray(projects.org_id, organizationIds),
        eq(issues.assignee_id, userId),
        ne(issues.status, "DONE"),
      ),
    );

  // Issues due between today and the next 7 days.

  const [dueSoonCount] = await db
    .select({
      count: count(),
    })
    .from(issues)
    .innerJoin(projects, eq(issues.project_id, projects.id))
    .where(
      and(
        inArray(projects.org_id, organizationIds),
        ne(issues.status, "DONE"),
        gte(issues.due_date, sql`CURRENT_DATE`),
        lte(issues.due_date, sql`CURRENT_DATE + INTERVAL '7 days'`),
      ),
    );

  // Status counts

  const statusRows = await db
    .select({
      status: issues.status,
      count: count(),
    })
    .from(issues)
    .innerJoin(projects, eq(issues.project_id, projects.id))
    .where(inArray(projects.org_id, organizationIds))
    .groupBy(issues.status);

  const issueStatusCounts = {
    BACKLOG: 0,
    TODO: 0,
    IN_PROGRESS: 0,
    IN_REVIEW: 0,
    DONE: 0,
  };

  for (const row of statusRows) {
    if (row.status in issueStatusCounts) {
      issueStatusCounts[row.status as keyof typeof issueStatusCounts] = Number(
        row.count,
      );
    }
  }

  // Recent issues

  const recentIssueRows = await db
    .select({
      id: issues.id,
      organizationId: projects.org_id,
      projectId: projects.id,
      projectKey: projects.key,
      projectName: projects.name,
      number: issues.number,
      title: issues.title,
      status: issues.status,
      priority: issues.priority,
      dueDate: issues.due_date,
      assigneeId: issues.assignee_id,
      createdAt: issues.created_at,
    })
    .from(issues)
    .innerJoin(projects, eq(issues.project_id, projects.id))
    .where(inArray(projects.org_id, organizationIds))
    .orderBy(desc(issues.created_at))
    .limit(5);

  // Get issue counts for the recent projects

  const recentProjectIds = projectRows.map((project) => project.id);

  const projectIssueCounts =
    recentProjectIds.length > 0
      ? await db
          .select({
            projectId: issues.project_id,
            count: count(),
          })
          .from(issues)
          .where(inArray(issues.project_id, recentProjectIds))
          .groupBy(issues.project_id)
      : [];

  const issueCountMap = new Map(
    projectIssueCounts.map((row) => [row.projectId, Number(row.count)]),
  );

  const recentProjects = projectRows.map((project) => ({
    id: project.id,
    organizationId: project.organizationId,
    organizationName: project.organizationName,
    name: project.name,
    key: project.key,
    status: project.status,
    issueCount: issueCountMap.get(project.id) ?? 0,
    createdAt: project.createdAt,
  }));

  return {
    totals: {
      projects: Number(projectCount.count),
      openIssues: Number(openIssueCount.count),
      assignedToMe: Number(assignedIssueCount.count),
      dueSoon: Number(dueSoonCount.count),
    },

    issueStatusCounts,

    recentIssues: recentIssueRows.map((issue) => ({
      id: issue.id,
      organizationId: issue.organizationId,
      projectId: issue.projectId,
      projectKey: issue.projectKey,
      projectName: issue.projectName,
      number: issue.number,
      title: issue.title,
      status: issue.status,
      priority: issue.priority,
      dueDate: issue.dueDate,
      assigneeId: issue.assigneeId,
      createdAt: issue.createdAt,
    })),

    recentProjects,
  };
}
