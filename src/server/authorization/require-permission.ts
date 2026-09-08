import { AuthorizationError } from "./authorization-error";
import { requireOrganizationMember } from "./organization-access";
import { rolePermissions } from "./permissions";
import type { Permission } from "./permissions";
import type { OrganizationMember } from "@/db/schemas";

export async function requireOrganizationPermission(
  userId: string,
  organizationId: string,
  permission: Permission,
): Promise<OrganizationMember> {
  const member = await requireOrganizationMember(userId, organizationId);

  const permissions = rolePermissions[member.role];

  if (permissions.has(permission)) {
    return member;
  } else {
    throw new AuthorizationError("Insufficient Permissions", 403);
  }
}
