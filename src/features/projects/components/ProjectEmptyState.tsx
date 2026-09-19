"use client";

import { FolderKanban } from "lucide-react";
import { Button, Card } from "@/components/ui";

interface ProjectEmptyStateProps {
  onCreate: () => void;
}

export function ProjectEmptyState({ onCreate }: ProjectEmptyStateProps) {
  return (
    <Card className="px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
        <FolderKanban className="h-5 w-5" />
      </div>

      <h2 className="mt-4 text-sm font-semibold text-zinc-950">
        No projects yet
      </h2>

      <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500">
        Create your first project to start organizing issues, members, and work.
      </p>

      <Button type="button" className="mt-5" onClick={onCreate}>
        Create project
      </Button>
    </Card>
  );
}
