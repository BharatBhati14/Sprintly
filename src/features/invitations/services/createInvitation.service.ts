import { db } from "@/db";
import {
  organization_members,
  organizationInvitations,
  users,
} from "@/db/schemas";
import { requireOrganizationMember } from "@/server/authorization/organization-access";
import { and, eq, gt, isNull } from "drizzle-orm";

type InputType = {
  userId: string;
  organizationId: string;
  email: string;
};

export async function CreateInvitation({
  userId,
  organizationId,
  email,
}: InputType) {
  const validMember = await requireOrganizationMember(userId, organizationId);

  if (validMember.role !== "OWNER" && validMember.role !== "ADMIN") {
    throw new Error("Insufficient Permissions");
  }

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    const [isMemberAlready] = await db
      .select()
      .from(organization_members)
      .where(
        and(
          eq(organization_members.user_id, existingUser.id),
          eq(organization_members.organization_id, organizationId),
        ),
      )
      .limit(1);

    if (isMemberAlready) {
      throw new Error("User Is Already A Member");
    }
  }

  const [isInvitationPending] = await db
    .select()
    .from(organizationInvitations)
    .where(
      and(
        eq(organizationInvitations.org_id, organizationId),
        eq(organizationInvitations.email, email),
        isNull(organizationInvitations.accepted_at),
        gt(organizationInvitations.expires_at, new Date()),
      ),
    )
    .limit(1);

  if (isInvitationPending) {
    throw new Error("Invitation is Already Pending");
  }

  const token = crypto.randomUUID().toString();

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const [invitation] = await db
    .insert(organizationInvitations)
    .values({
      org_id: organizationId,
      email,
      token,
      expires_at: expiresAt,
      invited_by: userId,
    })
    .returning();

  return invitation;
}
