import { db } from "@/db";
import { organization_members, users } from "@/db/schemas";
import { getCurrentUser } from "@/features/auth/current-user";
import { requireOrganizationMember } from "@/server/authorization/organization-access";
import { eq } from "drizzle-orm";

export async function getOrganizationMembers(organizationId: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const isOrgMember = await requireOrganizationMember(user.id, organizationId);

  if (!isOrgMember) {
    throw new Error("User is not member of Organization");
  }

  const members = await db
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,
      role: organization_members.role,
      joinedAt: organization_members.createdAt,
    })
    .from(organization_members)
    .innerJoin(users, eq(organization_members.user_id, users.id))
    .where(eq(organization_members.organization_id, organizationId));

  return members;
}
