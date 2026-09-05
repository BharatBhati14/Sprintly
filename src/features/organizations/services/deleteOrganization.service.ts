import { db } from "@/db";
import { organizations } from "@/db/schemas";
import { eq } from "drizzle-orm";

export async function deleteOrganization(organizationId: string) {
  const [deletedOrganization] = await db
    .delete(organizations)
    .where(eq(organizations.id, organizationId))
    .returning();

  if (!deletedOrganization) {
    throw new Error("Organization Not Found");
  }

  return deletedOrganization;
}
