"use client";

import Link from "next/link";
import { ArrowRight, FolderKanban } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import type { Project } from "../project.types";

interface ProjectCardProps {
  project: Project;
  organizationId: string;
}

export function ProjectCard({ project, organizationId }: ProjectCardProps) {
  return (
    <Link
      href={`/organizations/${organizationId}/projects/${project.id}`}
      className="block"
    >
      <Card className="group transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
              <FolderKanban className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-sm font-semibold text-zinc-950">
                  {project.name}
                </h2>

                <Badge variant="secondary">{project.key}</Badge>
              </div>

              <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                {project.description || "No description provided."}
              </p>
            </div>
          </div>

          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-950" />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
          <Badge variant="success">{project.status}</Badge>

          <span className="text-xs text-zinc-400">
            Created {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>
      </Card>
    </Link>
  );
}
