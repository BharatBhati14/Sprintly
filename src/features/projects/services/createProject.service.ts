import { db } from "@/db";
import { projectMembers, projects } from "@/db/schemas";
import { ProjectInput } from "../validations/project.validation";
import { requireOrganizationPermission } from "@/server/authorization/require-permission";
import { permissions } from "@/server/authorization/permissions";

export async function createProject(
  userId: string,
  organizationId: string,
  input: ProjectInput,
) {
  await requireOrganizationPermission(
    userId,
    organizationId,
    permissions.project.create,
  );

  const project = await db.transaction(async (tx) => {
    const [project] = await tx
      .insert(projects)
      .values({
        org_id: organizationId,
        name: input.name,
        description: input.description,
        key: input.key,
      })
      .returning();

    if (!project) {
      throw new Error("Failed to create project");
    }

    await tx.insert(projectMembers).values({
      project_id: project.id,
      user_id: userId,
    });

    return project;
  });

  return project;
}
