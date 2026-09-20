"use client";

import { useParams } from "next/navigation";
import { Plus } from "lucide-react";

import { AppShell } from "@/components/layout";
import { Button } from "@/components/ui";
import { ProjectShell } from "@/features/projects/components";
import { useProject } from "@/features/projects/useProject";
import {
  CreateIssueDialog,
  IssueEmptyState,
  IssueList,
} from "@/features/issues/components";
import { useIssues } from "@/features/issues/issue.hooks";
import { useState } from "react";

export default function ProjectIssuesPage() {
  const params = useParams<{
    organizationId: string;
    projectId: string;
  }>();

  const { organizationId, projectId } = params;

  const {
    project,
    isLoading: projectLoading,
    error: projectError,
  } = useProject(organizationId, projectId);

  const {
    issues,
    loading: issuesLoading,
    error: issuesError,
    create,
  } = useIssues(organizationId, projectId);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

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

  return (
    <AppShell>
      <ProjectShell
        organizationId={organizationId}
        projectId={projectId}
        projectName={project.name}
        projectKey={project.key}
        projectDesc={project.description}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">Issues</h2>

              <p className="mt-1 text-sm text-zinc-500">
                Track and manage work for this project.
              </p>
            </div>

            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              New issue
            </Button>
          </div>

          {issuesLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-xl border border-zinc-200 bg-zinc-50"
                />
              ))}
            </div>
          )}

          {!issuesLoading && issuesError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {issuesError}
            </div>
          )}

          {!issuesLoading && !issuesError && issues.length === 0 && (
            <IssueEmptyState />
          )}

          {!issuesLoading && !issuesError && issues.length > 0 && (
            <IssueList
              issues={issues}
              organizationId={organizationId}
              projectId={projectId}
            />
          )}
        </div>

        <CreateIssueDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onCreate={async (input) => {
            await create(input);
          }}
        />
      </ProjectShell>
    </AppShell>
  );
}
