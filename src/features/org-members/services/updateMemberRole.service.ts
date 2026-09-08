import { db } from "@/db";
import { organization_members, type OrganizationMember } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import { AuthorizationError } from "@/server/authorization/authorization-error";

type OrganizationRole = OrganizationMember["role"];

export async function updateMemberRole(
  currentMember: OrganizationMember,
  organizationId: string,
  targetUserId: string,
  newRole: OrganizationRole,
): Promise<OrganizationMember> {
  if (currentMember.role !== "OWNER" && currentMember.role !== "ADMIN") {
    throw new AuthorizationError("Insufficient Permissions", 403);
  }

  if (newRole === "OWNER") {
    throw new AuthorizationError("Ownership transfer is not allowed", 403);
  }

  const [targetMember] = await db
    .select()
    .from(organization_members)
    .where(
      and(
        eq(organization_members.organization_id, organizationId),
        eq(organization_members.user_id, targetUserId),
      ),
    )
    .limit(1);

  if (!targetMember) {
    throw new AuthorizationError("Organization member not found", 404);
  }

  if (targetMember.role === "OWNER") {
    throw new AuthorizationError("Organization owner cannot be modified", 403);
  }

  // ADMINs can only manage MEMBERs and VIEWERs
  if (
    currentMember.role === "ADMIN" &&
    targetMember.role !== "MEMBER" &&
    targetMember.role !== "VIEWER"
  ) {
    throw new AuthorizationError("Admins cannot modify other admins", 403);
  }

  // Nothing to change
  if (targetMember.role === newRole) {
    return targetMember;
  }

  const [updatedMember] = await db
    .update(organization_members)
    .set({
      role: newRole,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(organization_members.organization_id, organizationId),
        eq(organization_members.user_id, targetUserId),
      ),
    )
    .returning();

  if (!updatedMember) {
    throw new AuthorizationError("Organization member not found", 404);
  }

  return updatedMember;
}
