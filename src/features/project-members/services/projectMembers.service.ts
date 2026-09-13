import { db } from "@/db";
import {
  organization_members,
  OrganizationMember,
  projectMembers,
  projects,
  users,
} from "@/db/schemas";
import { AuthorizationError } from "@/server/authorization/authorization-error";
import { and, eq } from "drizzle-orm";

export async function getProjectMembers(projectId: string) {
  return await db
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,
      joinedAt: projectMembers.created_at,
    })
    .from(projectMembers)
    .innerJoin(users, eq(projectMembers.user_id, users.id))
    .where(eq(projectMembers.project_id, projectId));
}

// ############# add project member ############################
export async function addProjectMember(
  projectId: string,
  organizationId: string,
  targetUserId: string,
) {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project) {
    throw new Error("Project Not Found");
  }

  if (project.org_id !== organizationId) {
    throw new AuthorizationError("Unauthorized", 403);
  }

  const [targetUserBelongsToSameOrg] = await db
    .select()
    .from(organization_members)
    .where(
      and(
        eq(organization_members.user_id, targetUserId),
        eq(organization_members.organization_id, organizationId),
      ),
    )
    .limit(1);

  if (!targetUserBelongsToSameOrg) {
    throw new AuthorizationError("User Does Not Belongs To Organization", 401);
  }

  const [projectMember] = await db
    .insert(projectMembers)
    .values({
      project_id: projectId,
      user_id: targetUserId,
    })
    .returning();

  return projectMember;
}

// ############# delete project member ############################

export async function removeProjectMember(
  currentMember: OrganizationMember,
  organizationId: string,
  projectId: string,
  targetUserId: string,
) {
  // Only OWNER and ADMIN can remove other members.
  if (currentMember.role !== "OWNER" && currentMember.role !== "ADMIN") {
    throw new AuthorizationError("Insufficient Permissions", 403);
  }

  // if(currentMember.user_id === targetUserId){} ADMIN to ADMIN

  const [targetMember] = await db
    .select()
    .from(projectMembers)
    .where(
      and(
        eq(projectMembers.project_id, projectId),
        eq(projectMembers.user_id, targetUserId),
      ),
    )
    .limit(1);

  const [targetMemberForRole] = await db
    .select()
    .from(organization_members)
    .where(
      and(
        eq(organization_members.user_id, targetUserId),
        eq(organization_members.organization_id, organizationId),
      ),
    )
    .limit(1);

  if (!targetMember || !targetMemberForRole) {
    throw new AuthorizationError("Project member not found", 404);
  }

  // The OWNER cannot be removed
  if (targetMemberForRole.role === "OWNER") {
    throw new AuthorizationError("Organization owner cannot be removed", 403);
  }

  // ADMINs can only remove MEMBERs and VIEWERs.
  if (
    currentMember.role === "ADMIN" &&
    targetMemberForRole.role !== "MEMBER" &&
    targetMemberForRole.role !== "VIEWER"
  ) {
    throw new AuthorizationError("Admins cannot remove admins", 403);
  }

  // An OWNER can remove any non-owner member.
  const [deletedMember] = await db
    .delete(projectMembers)
    .where(
      and(
        eq(projectMembers.project_id, projectId),
        eq(projectMembers.user_id, targetUserId),
      ),
    )
    .returning();

  if (!deletedMember) {
    throw new AuthorizationError("Project member not found", 404);
  }

  return deletedMember;
}
