"use client";

import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";

import { AppShell } from "@/components/layout";
import { Button, Card, Skeleton } from "@/components/ui";

import {
  CreateLabelDialog,
  EditLabelDialog,
  DeleteLabelDialog,
  LabelEmptyState,
  LabelList,
} from "@/features/labels/components";

import { useOrganizationLabels } from "@/features/labels/label.hooks";
import { useOrganization } from "@/features/organizations/useOrganization";
import { useAuth } from "@/features/auth/auth.hooks";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Label } from "@/features/labels/label.types";

export default function OrganizationLabelsPage() {
  const params = useParams<{
    organizationId: string;
  }>();

  const organizationId = params.organizationId;

  const { user } = useAuth();

  const {
    organization,
    members,
    isLoading: organizationLoading,
  } = useOrganization(organizationId);

  const {
    labels,
    loading: labelsLoading,
    error,
    createLabel,
    updateLabel,
    deleteLabel,
    reload,
  } = useOrganizationLabels(organizationId);

  const [createOpen, setCreateOpen] = useState(false);
  const [editLabel, setEditLabel] = useState<Label | null>(null);
  const [deleteLabelState, setDeleteLabelState] = useState<Label | null>(null);

  const currentMember = members?.find((member) => member.userId === user?.id);

  const canManage =
    currentMember?.role === "OWNER" || currentMember?.role === "ADMIN";

  const loading = organizationLoading || labelsLoading;

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-72" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  if (!organization) {
    return (
      <AppShell>
        <Card>
          <div className="p-6">
            <p className="text-sm text-zinc-600">Organization not found.</p>
          </div>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <Link
          href={`/organizations/${organizationId}`}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Organization
        </Link>
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Labels
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Manage labels used across {organization.name}.
            </p>
          </div>

          {canManage && (
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create label
            </Button>
          )}
        </div>

        {/* Error */}
        {error && (
          <Card>
            <div className="flex items-center justify-between gap-4 p-4">
              <p className="text-sm text-red-600">{error}</p>

              <Button variant="secondary" onClick={reload}>
                Retry
              </Button>
            </div>
          </Card>
        )}

        {/* Empty */}
        {!error && labels.length === 0 && (
          <LabelEmptyState
            canManage={canManage}
            onCreate={() => setCreateOpen(true)}
          />
        )}

        {/* Labels */}
        {!error && labels.length > 0 && (
          <LabelList
            labels={labels}
            canManage={canManage}
            onEdit={(label) => {
              setEditLabel(label);
            }}
            onDelete={(label) => {
              setDeleteLabelState(label);
            }}
          />
        )}
      </div>

      {/* Create */}
      <CreateLabelDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={createLabel}
      />

      <EditLabelDialog
        open={editLabel !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditLabel(null);
          }
        }}
        label={editLabel}
        onUpdate={updateLabel}
      />

      <DeleteLabelDialog
        open={deleteLabelState !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteLabelState(null);
          }
        }}
        label={deleteLabelState}
        onDelete={deleteLabel}
      />
    </AppShell>
  );
}
