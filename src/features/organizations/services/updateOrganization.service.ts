import { db } from "@/db";
import { organizations } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { OrganizationUpdateInput } from "../validations/organization.validation";

export async function updateOrganization(
  organizationId: string,
  input: OrganizationUpdateInput,
) {
  const [updatedOrganization] = await db
    .update(organizations)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, organizationId))
    .returning();

  if (!updatedOrganization) {
    throw new Error("Organization Not Found");
  }

  return updatedOrganization;
}
