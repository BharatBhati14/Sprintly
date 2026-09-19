"use client";

import { ProjectCard } from "./ProjectCard";
import type { Project } from "../project.types";

interface ProjectListProps {
  projects: Project[];
  organizationId: string;
}

export function ProjectList({ projects, organizationId }: ProjectListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          organizationId={organizationId}
        />
      ))}
    </div>
  );
}
