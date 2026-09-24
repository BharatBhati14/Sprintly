"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout";
import { ProjectShell } from "@/features/projects/components";
import {
  ProjectOverview,
  ProjectSettingsForm,
  ProjectSettingsDialog,
} from "@/features/projects/components";
import { useProject } from "@/features/projects/useProject";
import { useOrganization } from "@/features/organizations/useOrganization";
import { useAuth } from "@/features/auth/auth.hooks";

export default function ProjectSettingsPage() {
  const params = useParams<{
    organizationId: string;
    projectId: string;
  }>();

  const organizationId = params.organizationId;
  const projectId = params.projectId;

  const { user } = useAuth();

  const {
    project,
    isLoading: projectLoading,
    error: projectError,
    updateProject,
  } = useProject(organizationId, projectId);

  const { members: organizationMembers } = useOrganization(organizationId);

  const [settingsOpen, setSettingsOpen] = useState(false);

  if (projectLoading) {
    return (
      <AppShell>
        <div className="text-sm text-zinc-500">Loading project... </div>
      </AppShell>
    );
  }

  if (projectError || !project) {
    return (
      <AppShell>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {projectError || "Project not found"}
        </div>
      </AppShell>
    );
  }

  const currentOrganizationMember = organizationMembers.find(
    (member) => member.userId === user?.id,
  );

  const canManageProject =
    currentOrganizationMember?.role === "OWNER" ||
    currentOrganizationMember?.role === "ADMIN";

  return (
    <AppShell>
      <ProjectShell
        organizationId={organizationId}
        projectId={projectId}
        projectName={project.name}
        projectKey={project.key}
        projectDesc={project.description}
      >
        <div className="space-y-6 px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">
                Project settings
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Manage your project's basic information.
              </p>
            </div>
            {canManageProject && (
              <ProjectSettingsDialog
                project={project}
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                onSave={async (input) => {
                  await updateProject(input);
                }}
              />
            )}
          </div>
          <ProjectOverview project={project} />
          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-zinc-950">
                Basic information
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                View the basic information for this project.
              </p>
            </div>

            <ProjectSettingsForm
              project={project}
              onSave={async (input) => {
                if (!canManageProject) {
                  throw new Error(
                    "You do not have permission to update this project.",
                  );
                }

                await updateProject(input);
              }}
            />
          </div>
        </div>
      </ProjectShell>
    </AppShell>
  );
}
