import { db } from "@/db";
import { projects, type Project, type OrganizationMember } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import { AuthorizationError } from "./authorization-error";
import { requireOrganizationPermission } from "./require-permission";
import type { Permission } from "./permissions";

type ProjectAccessResult = {
  project: Project;
  organizationMember: OrganizationMember;
};

export async function requireProjectPermission(
  userId: string,
  organizationId: string,
  projectId: string,
  permission: Permission,
): Promise<ProjectAccessResult> {
  const organizationMember = await requireOrganizationPermission(
    userId,
    organizationId,
    permission,
  );

  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.org_id, organizationId)))
    .limit(1);

  if (!project) {
    throw new AuthorizationError("Project Not Found", 404);
  }

  return {
    project,
    organizationMember,
  };
}
