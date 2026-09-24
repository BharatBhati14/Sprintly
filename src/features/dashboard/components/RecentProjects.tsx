"use client";

import Link from "next/link";
import { ArrowRight, FolderKanban } from "lucide-react";

import { Badge, Card } from "@/components/ui";

import type { DashboardData } from "../dashboard.types";

interface RecentProjectsProps {
  data: DashboardData;
}

export function RecentProjects({ data }: RecentProjectsProps) {
  return (
    <Card className="h-full p-4 md:p-6">
      <div>
        <h2 className="text-sm font-semibold text-zinc-900">Recent projects</h2>

        <p className="mt-1 text-xs text-zinc-500">
          Projects recently added to your workspace
        </p>
      </div>

      {data.recentProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FolderKanban className="h-5 w-5 text-zinc-400" />

          <p className="mt-3 text-sm font-medium text-zinc-700">
            No projects yet
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Create a project to get started.
          </p>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-zinc-100">
          {data.recentProjects.slice(0, 5).map((project) => (
            <Link
              key={project.id}
              href={`/organizations/${project.organizationId}/projects/${project.id}`}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                  <FolderKanban className="h-4 w-4 text-zinc-600" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-zinc-800">
                      {project.name}
                    </p>

                    <Badge variant="secondary">{project.key}</Badge>
                  </div>

                  <p className="mt-1 text-xs text-zinc-500">
                    {project.organizationName} · {project.issueCount}{" "}
                    {project.issueCount === 1 ? "issue" : "issues"}
                  </p>
                </div>
              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400" />
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
