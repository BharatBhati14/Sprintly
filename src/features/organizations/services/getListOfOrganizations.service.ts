import { db } from "@/db";
import { organization_members, organizations, User } from "@/db/schemas";
import { eq, sql } from "drizzle-orm";

export async function getListOrganization(userId: string) {
  return await db
    .select({
      id: organizations.id,
      name: organizations.name,
      slug: organizations.slug,
      createdAt: organizations.createdAt,
      updatedAt: organizations.updatedAt,
      role: organization_members.role,
    })
    .from(organization_members)
    .innerJoin(
      organizations,
      eq(organization_members.organization_id, organizations.id),
    )
    .where(eq(organization_members.user_id, userId));
}
