"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProjectNavigation } from "./ProjectNavigation";

interface ProjectShellProps {
  organizationId: string;
  projectId: string;
  projectName: string;
  projectKey: string;
  projectDesc: string | null;
  children: React.ReactNode;
}

export function ProjectShell({
  organizationId,
  projectId,
  projectName,
  projectKey,
  projectDesc,
  children,
}: ProjectShellProps) {
  return (
    <div className="space-y-6 mt-4">
      <div className="space-y-4 pl-4">
        <Link
          href={`/organizations/${organizationId}/projects`}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-xs font-semibold text-zinc-700">
            {projectKey}
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold text-zinc-950">
              {projectName}
            </h1>

            <p className="text-sm text-zinc-500">
              {projectKey} {projectDesc ? `\u00A0\u00A0\|\u00A0\u00A0\ ${projectDesc}` : "No description"}</p>
          </div>
        </div>

        <ProjectNavigation
          organizationId={organizationId}
          projectId={projectId}
        />
      </div>

      <main>{children}</main>
    </div>
  );
}
