"use client";

import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

import { AppShell, PageHeader } from "@/components/layout";

import { Button, Skeleton } from "@/components/ui";

import {
  CreateOrganizationDialog,
  OrganizationList,
} from "@/features/organizations/components";

import { useOrganizations } from "@/features/organizations/organization.hooks";

export default function OrganizationsPage() {
  const { organizations, isLoading, error, reload, addOrganization } =
    useOrganizations();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Organizations"
          description="Manage your workspaces and teams."
          actions={
            <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New organization
            </Button>
          }
        />

        {error && (
          <div className="mt-6 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">{error}</p>

            <Button
              variant="secondary"
              size="sm"
              onClick={reload}
              className="shrink-0 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        )}

        <div className="mt-6">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-zinc-200 bg-white p-5"
                >
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="mt-2 h-4 w-24" />
                  <Skeleton className="mt-6 h-4 w-28" />
                </div>
              ))}
            </div>
          ) : (
            <OrganizationList organizations={organizations} />
          )}
        </div>
      </div>

      <CreateOrganizationDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={async (input) => {
          await addOrganization(input);
        }}
      />
    </AppShell>
  );
}
