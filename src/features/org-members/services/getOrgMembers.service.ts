import { db } from "@/db";
import { organization_members, users } from "@/db/schemas";
import { eq } from "drizzle-orm";

export async function getOrganizationMembers(organizationId: string) {
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
