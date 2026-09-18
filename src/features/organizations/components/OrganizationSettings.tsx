"use client";

import { Settings } from "lucide-react";
import { Card } from "@/components/ui";
import { OrganizationSettingsForm } from "./OrganizationSettingsForm";
import type { Organization } from "../organization.types";

interface OrganizationSettingsProps {
  organization: Organization;
  currentUserRole: string;
  onSave: (input: { name?: string; slug?: string }) => Promise<void>;
}

export function OrganizationSettings({
  organization,
  currentUserRole,
  onSave,
}: OrganizationSettingsProps) {
  const canManage = currentUserRole === "OWNER" || currentUserRole === "ADMIN";

  return (
    <Card>
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-700">
          <Settings className="h-4 w-4" />
        </div>

        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            Organization settings
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Manage your organization's basic information.
          </p>
        </div>
      </div>

      <OrganizationSettingsForm
        organization={organization}
        canManage={canManage}
        onSave={onSave}
      />
    </Card>
  );
}
