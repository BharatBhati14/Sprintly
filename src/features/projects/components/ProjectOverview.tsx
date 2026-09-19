"use client";

import { CalendarDays, FolderKanban } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import type { Project } from "../project.types";

interface ProjectOverviewProps {
  project: Project;
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
            <FolderKanban className="h-4 w-4" />
          </div>

          <div>
            <p className="text-xs text-zinc-500">Project key</p>
            <p className="mt-2 text-sm font-semibold text-zinc-950">
              {project.key}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
            <CalendarDays className="h-4 w-4" />
          </div>

          <div>
            <p className="text-xs text-zinc-500">Created</p>
            <p className="mt-2 text-sm font-semibold text-zinc-950">
              {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-xs text-zinc-500">Status</p>

        <div className="mt-2">
          <Badge
            variant={project.status === "ACTIVE" ? "success" : "secondary"}
          >
            {project.status}
          </Badge>
        </div>
      </Card>
    </div>
  );
}
