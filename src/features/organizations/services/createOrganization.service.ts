import { db } from "@/db";
import { OrganizationInput } from "../validations/organization.validation";
import { createSlug } from "@/lib/createSlug";
import {
  Organization,
  organization_members,
  OrganizationMember,
  organizations,
  User,
} from "@/db/schemas";
import { eq } from "drizzle-orm";

interface ICreateOrg {
  organization: Organization;
  orgMember: OrganizationMember;
}

export async function createOrganization(
  user: Omit<User, "password">,
  input: OrganizationInput,
): Promise<ICreateOrg> {
  const { organization, orgMember } = await db.transaction(async (tx) => {
    const slug = await createSlug(input.name, 245);

    let orgWithSlug,
      index: number = 0,
      validSlug: string = "";
    do {
      if (index > 10) break;

      [orgWithSlug] = await tx
        .select()
        .from(organizations)
        .where(eq(organizations.slug, index > 0 ? `${slug}-${index}` : slug))
        .limit(1);

      if (!orgWithSlug) {
        validSlug = index === 0 ? slug : `${slug}-${index}`;
        break;
      }

      index++;
    } while (orgWithSlug);

    if (validSlug.length <= 0 || !validSlug) {
      throw new Error("Slug Creation Failed");
    }

    const [organization] = await tx
      .insert(organizations)
      .values({
        name: input.name,
        slug: validSlug,
      })
      .returning();

    if (!organization) {
      throw new Error("Organization Creation Failed");
      tx.rollback();
    }

    const [orgMember] = await tx
      .insert(organization_members)
      .values({
        organization_id: organization.id,
        user_id: user.id,
        role: "OWNER",
      })
      .returning();

    if (!orgMember) tx.rollback();

    return { organization, orgMember };
  });
  return { organization, orgMember };
}
