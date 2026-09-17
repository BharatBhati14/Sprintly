import { Building2 } from "lucide-react";

import { Card } from "@/components/ui";

export function OrganizationEmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
        <Building2 className="h-5 w-5 text-zinc-500" />
      </div>

      <h2 className="mt-4 text-sm font-semibold text-zinc-950">
        No organizations yet
      </h2>

      <p className="mt-1 max-w-sm text-sm text-zinc-500">
        Create your first organization to start managing projects, issues, and
        your team.
      </p>
    </Card>
  );
}
