import { db } from "@/db";
import { projects } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import { UpdateProjectInput } from "../validations/project.validation";

// get individual project

export async function getProject(projectId: string, organizationId: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.org_id, organizationId)))
    .limit(1);

  if (!project) {
    throw new Error("Project Not Found");
  }

  return project;
}

// update project by id

export async function updateProject(
  projectId: string,
  input: UpdateProjectInput,
) {
  const [project] = await db
    .update(projects)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, projectId))
    .returning();

  if (!project) {
    throw new Error("Project Not Found");
  }

  return project;
}

// archive project by id

export async function archiveProject(projectId: string) {
  const [project] = await db
    .update(projects)
    .set({
      status: "ARCHIVED",
      updatedAt: new Date(),
    })
    .where(eq(projects.id, projectId))
    .returning();

  if (!project) {
    throw new Error("Project Not Found");
  }

  return project;
}

// delete project by id
export async function deleteProject(projectId: string) {
  const [deletedProject] = await db
    .delete(projects)
    .where(eq(projects.id, projectId))
    .returning();

  if (!deletedProject) {
    throw new Error("Project Not Found");
  }

  return deletedProject;
}
