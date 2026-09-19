"use client";

import { ArrowLeft, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/layout";
import { Button, Card, Dialog, Skeleton } from "@/components/ui";
import { useAuth } from "@/features/auth/auth.hooks";
import {
  DeleteOrganizationDialog,
  OrganizationMembers,
  OrganizationSettingsForm,
} from "@/features/organizations/components";
import { useOrganization } from "@/features/organizations/useOrganization";
import { UserPlus } from "lucide-react";
import { InviteMemberDialog } from "@/features/invitations/components/InviteMemberDialog";
import type {
  OrganizationMember,
  OrganizationRole,
} from "@/features/organizations/organization.types";

import {
  updateMemberRole,
  removeMember,
  deleteOrganization,
} from "@/features/organizations/organization.api";

export default function OrganizationPage() {
  const params = useParams<{ organizationId: string }>();
  const organizationId = params.organizationId;

  const { user } = useAuth();

  const {
    organization,
    members,
    isLoading,
    error,
    reload,
    refresh,
    updateOrganization,
  } = useOrganization(organizationId);

  const [selectedMember, setSelectedMember] =
    useState<OrganizationMember | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const currentMember = members.find((member) => member.userId === user?.id);

  const canManageMembers =
    currentMember?.role === "OWNER" || currentMember?.role === "ADMIN";

  if (isLoading) {
    return (
      <AppShell>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-6 h-8 w-64" />
          <Skeleton className="mt-2 h-5 w-80" />

          <div className="mt-8">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !organization) {
    return (
      <AppShell>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/organizations"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Organizations
          </Link>

          <Card className="mt-6 px-6 py-12 text-center">
            <h1 className="text-sm font-semibold text-zinc-950">
              Organization unavailable
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              {error ?? "This organization could not be found."}
            </p>

            <Button variant="secondary" className="mt-5" onClick={reload}>
              Try again
            </Button>
          </Card>
        </div>
      </AppShell>
    );
  }

  const handleRoleChange = async (userId: string, role: OrganizationRole) => {
    await updateMemberRole(organizationId, userId, {
      role,
    });

    await refresh();
  };

  const handleRemove = async (userId: string) => {
    await removeMember(organizationId, userId);

    await refresh();
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/organizations"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Organizations
        </Link>

        <div className="mt-6">
          <PageHeader
            title={organization.name}
            description={`@${organization.slug}`}
            actions={
              canManageMembers ? (
                // <Button variant="secondary" className="gap-2">
                //   <Settings className="h-4 w-4" />
                //   Settings
                // </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              ) : undefined
            }
          />
        </div>
        {/* {organization && currentMember && (
          <OrganizationSettings
            organization={organization}
            currentUserRole={currentMember.role}
            onSave={async (input) => {
              await updateOrganization(input);
            }}
          />
        )} */}

        {(currentMember?.role === "OWNER" ||
          currentMember?.role === "ADMIN") && (
          <Button type="button" onClick={() => setInviteDialogOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Invite member
          </Button>
        )}

        <InviteMemberDialog
          orgName={organization.name}
          organizationId={organizationId}
          open={inviteDialogOpen}
          onClose={() => setInviteDialogOpen(false)}
        />

        <div className="mt-8">
          <OrganizationMembers
            members={members}
            currentUserId={user?.id!}
            currentUserRole={currentMember?.role!}
            onRoleChange={handleRoleChange}
            onRemove={handleRemove}
          />
        </div>

        {selectedMember && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Member management UI will be connected in the next step.
          </div>
        )}

        {organization && currentMember && (
          <Dialog
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            title="Organization settings"
            description="Manage your organization's basic information."
          >
            <OrganizationSettingsForm
              organization={organization}
              canManage={
                currentMember.role === "OWNER" || currentMember.role === "ADMIN"
              }
              onSave={async (input) => {
                await updateOrganization(input);
                setSettingsOpen(false);
              }}
            />

            <div className="mt-6 border-t border-zinc-200 pt-6">
              <div>
                <h3 className="text-sm font-semibold text-red-700">
                  Danger zone
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Permanently delete this organization and its associated data.
                </p>
              </div>

              <Button
                type="button"
                variant="danger"
                className="mt-4"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete organization
              </Button>
            </div>
          </Dialog>
        )}

        <DeleteOrganizationDialog
          open={deleteDialogOpen}
          organizationName={organization.name}
          onClose={() => setDeleteDialogOpen(false)}
          onDelete={async () => {
            await deleteOrganization(organizationId);

            window.location.href = "/organizations";
          }}
        />
      </div>
    </AppShell>
  );
}
