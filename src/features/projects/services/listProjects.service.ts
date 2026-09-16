import { db } from "@/db";
import { projectMembers, projects } from "@/db/schemas";
import {
  getPagination,
  getPaginationMeta,
  type PaginationQuery,
} from "@/lib/pagination/pagination";
import { and, count, eq } from "drizzle-orm";

export async function listProjects(
  userId: string,
  organizationId: string,
  pagination: PaginationQuery,
  query?: { status?: "ACTIVE" | "ARCHIVED" },
) {
  const { page, limit, offset } = getPagination(
    pagination.page,
    pagination.limit,
  );

  const conditions = [
    eq(projectMembers.user_id, userId),
    eq(projects.org_id, organizationId),
  ];

  if (query?.status) {
    conditions.push(eq(projects.status, query.status));
  }

  const projectList = await db
    .select({
      id: projects.id,
      organizationId: projects.org_id,
      name: projects.name,
      key: projects.key,
      description: projects.description,
      status: projects.status,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
      createdBy: projectMembers.user_id,
    })
    .from(projectMembers)
    .innerJoin(projects, eq(projectMembers.project_id, projects.id))
    .where(and(...conditions))
    .limit(limit)
    .offset(offset);
  // eq(projectMembers.user_id, userId)

  const [{ total }] = await db
    .select({ total: count() })
    .from(projectMembers)
    .innerJoin(projects, eq(projectMembers.project_id, projects.id))
    .where(and(...conditions));

  return {
    data: projectList,
    pagination: getPaginationMeta(page, limit, Number(total)),
  };
}
