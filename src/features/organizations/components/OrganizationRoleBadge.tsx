import { Badge } from "@/components/ui";

import type { OrganizationRole } from "../organization.types";

interface OrganizationRoleBadgeProps {
  role: OrganizationRole;
}

const roleLabels: Record<OrganizationRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
  VIEWER: "Viewer",
};

export function OrganizationRoleBadge({ role }: OrganizationRoleBadgeProps) {
  return <Badge variant="secondary">{roleLabels[role]}</Badge>;
}
