"use client";

import { useParams } from "next/navigation";

import { AppShell } from "@/components/layout";
import { ProjectShell } from "@/features/projects/components";
import {
  ProjectMembers,
  AddProjectMemberDialog,
} from "@/features/project-members/components";
import { useProject } from "@/features/projects/useProject";
import { useProjectMembers } from "@/features/project-members/useProjectMembers";
import { useOrganization } from "@/features/organizations/useOrganization";
import { useAuth } from "@/features/auth/auth.hooks";
import { useState } from "react";

export default function ProjectMembersPage() {
  const params = useParams<{
    organizationId: string;
    projectId: string;
  }>();

  const [addMemberOpen, setAddMemberOpen] = useState(false);

  const organizationId = params.organizationId;
  const projectId = params.projectId;

  const { user } = useAuth();
  const {
    project,
    isLoading: projectLoading,
    error: projectError,
  } = useProject(organizationId, projectId);

  const {
    members,
    isLoading: membersLoading,
    error: membersError,
    addMember,
    reload: reloadMembers,
    removeMember,
  } = useProjectMembers(organizationId, projectId);

  const { members: organizationMembers } = useOrganization(organizationId);

  if (projectLoading) {
    return (
      <AppShell>
        <div className="text-sm text-zinc-500">Loading project...</div>
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

  const canManageProjectMembers =
    currentOrganizationMember?.role === "OWNER" ||
    currentOrganizationMember?.role === "ADMIN";

  const memberIds = members.map((member) => member.userId);

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
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">
                Project members
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Manage the members who have access to this project.
              </p>
            </div>

            {canManageProjectMembers && (
              <AddProjectMemberDialog
                organizationMembers={organizationMembers}
                projectMemberIds={memberIds}
                onAdd={addMember}
                open={addMemberOpen}
                onClose={() => setAddMemberOpen(false)}
              />
            )}
          </div>

          <ProjectMembers
            members={members}
            isLoading={membersLoading}
            error={membersError}
            canManage={canManageProjectMembers}
            onRemove={removeMember}
            onAdd={() => setAddMemberOpen(true)}
            onRetry={reloadMembers}
          />
        </div>
      </ProjectShell>
    </AppShell>
  );
}
