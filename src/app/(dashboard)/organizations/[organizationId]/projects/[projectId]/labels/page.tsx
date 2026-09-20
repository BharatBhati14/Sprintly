"use client";

import { useParams } from "next/navigation";

import { AppShell } from "@/components/layout";
import { ProjectShell } from "@/features/projects/components";
import { useProject } from "@/features/projects/useProject";

export default function ProjectLabelsPage() {
  const params = useParams<{
    organizationId: string;
    projectId: string;
  }>();

  const { organizationId, projectId } = params;

  const { project, isLoading, error } = useProject(organizationId, projectId);

  if (isLoading) {
    return (
      <AppShell>
        <div className="text-sm text-zinc-500">Loading project...</div>
      </AppShell>
    );
  }

  if (error || !project) {
    return (
      <AppShell>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || "Project not found"}
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
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-zinc-950">Labels</h2>

          <p className="mt-2 text-sm text-zinc-500">
            Label management will be available here.
          </p>
        </div>
      </ProjectShell>
    </AppShell>
  );
}
