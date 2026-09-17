import { OrganizationCard } from "./OrganizationCard";
import { OrganizationEmptyState } from "./OrganizationEmptyState";

import type { Organization } from "../organization.types";

interface OrganizationListProps {
  organizations: Organization[];
}

export function OrganizationList({ organizations }: OrganizationListProps) {
  if (organizations.length === 0) {
    return <OrganizationEmptyState />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {organizations.map((organization) => (
        <OrganizationCard key={organization.id} organization={organization} />
      ))}
    </div>
  );
}
