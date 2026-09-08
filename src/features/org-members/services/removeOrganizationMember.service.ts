import { db } from "@/db";
import { organization_members, type OrganizationMember } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import { AuthorizationError } from "@/server/authorization/authorization-error";

export async function removeOrganizationMember(
  currentMember: OrganizationMember,
  organizationId: string,
  targetUserId: string,
): Promise<OrganizationMember> {
  // Only OWNER and ADMIN can remove other members.
  if (currentMember.role !== "OWNER" && currentMember.role !== "ADMIN") {
    throw new AuthorizationError("Insufficient Permissions", 403);
  }

  //   if(currentMember.user_id === targetUserId){} ADMIN to ADMIN

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

  // The OWNER cannot be removed
  if (targetMember.role === "OWNER") {
    throw new AuthorizationError("Organization owner cannot be removed", 403);
  }

  // ADMINs can only remove MEMBERs and VIEWERs.
  if (
    currentMember.role === "ADMIN" &&
    targetMember.role !== "MEMBER" &&
    targetMember.role !== "VIEWER"
  ) {
    throw new AuthorizationError("Admins cannot remove admins", 403);
  }

  // An OWNER can remove any non-owner member.
  const [deletedMember] = await db
    .delete(organization_members)
    .where(
      and(
        eq(organization_members.organization_id, organizationId),
        eq(organization_members.user_id, targetUserId),
      ),
    )
    .returning();

  if (!deletedMember) {
    throw new AuthorizationError("Organization member not found", 404);
  }

  return deletedMember;
}
