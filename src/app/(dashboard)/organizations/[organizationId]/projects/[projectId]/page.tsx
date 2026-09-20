"use client";

import { Archive, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Button, Card, Dialog, Skeleton } from "@/components/ui";

import { useAuth } from "@/features/auth/auth.hooks";
import { ProjectShell } from "@/features/projects/components";
import {
  DeleteProjectDialog,
  ProjectOverview,
  ProjectSettingsForm,
} from "@/features/projects/components";

import {
  AddProjectMemberDialog,
  ProjectMembers,
} from "@/features/project-members/components";
import { useProjectMembers } from "@/features/project-members/useProjectMembers";
import { useProject } from "@/features/projects/useProject";
import type { UpdateProjectInput } from "@/features/projects/project.types";
import { useOrganization } from "@/features/organizations/useOrganization";

export default function ProjectPage() {
  const params = useParams<{
    organizationId: string;
    projectId: string;
  }>();

  const router = useRouter();

  const organizationId = params.organizationId;
  const projectId = params.projectId;

  const {
    project,
    isLoading,
    error,
    reload,
    updateProject,
    archiveProject,
    deleteProject,
  } = useProject(organizationId, projectId);

  const {
    members: projectMembers,
    isLoading: membersLoading,
    error: membersError,
    reload: reloadMembers,
    addMember,
    removeMember,
  } = useProjectMembers(organizationId, projectId);

  const { members: organizationMembers } = useOrganization(organizationId);

  const { user } = useAuth();

  const currentOrganizationMember = organizationMembers.find(
    (member) => member.userId === user?.id,
  );

  const canManageProjectMembers =
    currentOrganizationMember?.role === "OWNER" ||
    currentOrganizationMember?.role === "ADMIN";

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  if (isLoading) {
    return (
      <AppShell>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-28" />

          <div className="mt-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-2 h-5 w-48" />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !project) {
    return (
      <AppShell>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href={`/organizations/${organizationId}/projects`}
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Projects
          </Link>

          <Card className="mt-6 px-6 py-12 text-center">
            <h1 className="text-sm font-semibold text-zinc-950">
              Project unavailable
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              {error ?? "This project could not be found."}
            </p>

            <Button variant="secondary" className="mt-5" onClick={reload}>
              Try again
            </Button>
          </Card>
        </div>
      </AppShell>
    );
  }

  const handleUpdate = async (input: UpdateProjectInput) => {
    await updateProject(input);
  };

  const handleArchive = async () => {
    try {
      setIsArchiving(true);

      await archiveProject();

      setArchiveOpen(false);
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDelete = async () => {
    await deleteProject();

    router.replace(`/organizations/${organizationId}/projects`);
  };

  return (
    <AppShell>
      <ProjectShell
        organizationId={organizationId}
        projectId={projectId}
        projectName={project.name}
        projectKey={project.key}
        projectDesc={project.description}
      >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mt-0">
            <ProjectOverview project={project} />
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <Card className="px-6 py-6">
              <h2 className="text-sm font-semibold text-zinc-950">Issues</h2>

              <p className="mt-1 text-sm text-zinc-500">
                Issue management will be available here.
              </p>
            </Card>

            <ProjectMembers
              members={projectMembers}
              isLoading={membersLoading}
              error={membersError}
              canManage={canManageProjectMembers}
              onAdd={() => setAddMemberOpen(true)}
              onRemove={removeMember}
              onRetry={reloadMembers}
            />
          </div>

          <div className="mt-8">
            <Card className="border-red-200 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-950">
                    Danger zone
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Permanently remove this project and its associated data.
                  </p>
                </div>

                <Button variant="danger" onClick={() => setDeleteOpen(true)}>
                  <Trash2 className="h-4 w-4" />
                  Delete project
                </Button>
              </div>
            </Card>
          </div>

          <AddProjectMemberDialog
            open={addMemberOpen}
            onClose={() => setAddMemberOpen(false)}
            organizationMembers={organizationMembers}
            projectMemberIds={projectMembers.map((member) => member.userId)}
            onAdd={addMember}
          />

          <Dialog
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            title="Project settings"
            description="Manage your project's basic information."
          >
            <ProjectSettingsForm
              project={project}
              onSave={async (input) => {
                await handleUpdate(input);
                setSettingsOpen(false);
              }}
            />
          </Dialog>

          <Dialog
            open={archiveOpen}
            onClose={() => {
              if (!isArchiving) {
                setArchiveOpen(false);
              }
            }}
            title="Archive project"
            description="Archived projects are no longer active."
          >
            <div className="space-y-5">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                {project.status === "ARCHIVED" ? (
                  <p className="text-sm text-amber-800">
                    Project{" "}
                    <span className="font-semibold">{project.name}</span> is{" "}
                    <span className="border-b border-amber-600">already</span>{" "}
                    archived!
                  </p>
                ) : (
                  <p className="text-sm text-amber-800">
                    Are you sure you want to archive{" "}
                    <span className="font-semibold">{project.name}</span>?
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setArchiveOpen(false)}
                  disabled={isArchiving}
                >
                  Cancel
                </Button>

                <Button
                  loading={isArchiving}
                  onClick={handleArchive}
                  disabled={project.status === "ARCHIVED"}
                >
                  <Archive className="h-4 w-4" />
                  Archive project
                </Button>
              </div>
            </div>
          </Dialog>

          <DeleteProjectDialog
            project={project}
            open={deleteOpen}
            onClose={() => setDeleteOpen(false)}
            onDelete={handleDelete}
          />
        </div>
      </ProjectShell>
    </AppShell>
  );
}
