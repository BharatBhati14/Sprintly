import { db } from "@/db";
import { projectMembers, projects } from "@/db/schemas";
import { eq } from "drizzle-orm";

export async function listProjects(
  userId: string,
  organizationId: string,
  query?: { status: "active" | "archive" },
) {
  return await db
    .select({
      id: projects.id,
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
    .where(eq(projectMembers.user_id, userId));
}
