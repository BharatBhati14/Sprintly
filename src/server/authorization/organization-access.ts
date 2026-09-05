import { db } from "@/db";
import { organization_members, OrganizationMember } from "@/db/schemas";
import { and, eq } from "drizzle-orm";

export async function requireOrganizationMember(
  userId: string,
  organizationId: string,
): Promise<OrganizationMember> {
  const [membership] = await db
    .select()
    .from(organization_members)
    .where(
      and(
        eq(organization_members.user_id, userId),
        eq(organization_members.organization_id, organizationId),
      ),
    )
    .limit(1);

  if (!membership) {
    throw new Error("Organization membership not found");
  }

  return membership;
}
