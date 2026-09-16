import { db } from "@/db";
import { organization_members, organizations } from "@/db/schemas";
import {
  getPagination,
  getPaginationMeta,
  type PaginationQuery,
} from "@/lib/pagination/pagination";
import { count, eq } from "drizzle-orm";

export async function getListOrganization(
  userId: string,
  pagination: PaginationQuery,
) {
  const { page, limit, offset } = getPagination(
    pagination.page,
    pagination.limit,
  );

  const organizationsList = await db
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
    .where(eq(organization_members.user_id, userId))
    .limit(limit)
    .offset(offset);

  const [{ total }] = await db
    .select({ total: count() })
    .from(organization_members)
    .where(eq(organization_members.user_id, userId));
  return {
    data: organizationsList,
    pagination: getPaginationMeta(page, limit, Number(total)),
  };
}
