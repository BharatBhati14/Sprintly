import { db } from "@/db";
import { organization_members, organizationInvitations } from "@/db/schemas";
import { getCurrentUser } from "@/features/auth/current-user";
import { and, eq, gt, isNull } from "drizzle-orm";

export async function acceptInvitation(token: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const memberCreated = await db.transaction(async (tx) => {
    const [isInvitationExists] = await tx
      .select()
      .from(organizationInvitations)
      .where(
        and(
          eq(organizationInvitations.token, token),
          isNull(organizationInvitations.accepted_at),
          gt(organizationInvitations.expires_at, new Date()),
        ),
      )
      .limit(1);

    if (!isInvitationExists) {
      throw new Error("Invitation Does Not Exists Or Has Expired");
    }

    if (user.email !== isInvitationExists.email) {
      throw new Error("Invitation email does not match authenticated user");
    }

    const [existingMember] = await tx
      .select()
      .from(organization_members)
      .where(
        and(
          eq(organization_members.organization_id, isInvitationExists.org_id),
          eq(organization_members.user_id, user.id),
        ),
      )
      .limit(1);

    if (existingMember) {
      throw new Error("User is already a member of this organization");
    }

    const [memberCreated] = await tx
      .insert(organization_members)
      .values({
        organization_id: isInvitationExists.org_id,
        user_id: user.id,
        role: "MEMBER",
      })
      .returning();

    const [updatedExistingInvitation] = await tx
      .update(organizationInvitations)
      .set({
        accepted_at: new Date(),
      })
      .where(eq(organizationInvitations.id, isInvitationExists.id))
      .returning();

    return memberCreated;
  });

  return memberCreated;
}
