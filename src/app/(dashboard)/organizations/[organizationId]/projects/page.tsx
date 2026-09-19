"use client";

import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { AppShell, PageHeader } from "@/components/layout";
import { Button, Card, Skeleton } from "@/components/ui";

import {
  CreateProjectDialog,
  ProjectEmptyState,
  ProjectList,
} from "@/features/projects/components";

import { useProjects } from "@/features/projects/project.hooks";

export default function ProjectsPage() {
  const params = useParams<{
    organizationId: string;
  }>();

  const organizationId = params.organizationId;

  const { projects, isLoading, error, reload, createProject } =
    useProjects(organizationId);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <AppShell>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-28" />
          <div className="mt-6 flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-40" />
              <Skeleton className="mt-2 h-5 w-72" />
            </div>

            <Skeleton className="h-10 w-32" />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-44 w-full" />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href={`/organizations/${organizationId}`}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Organization
        </Link>

        <div className="mt-6">
          <PageHeader
            title="Projects"
            description="Manage the projects inside this organization."
            actions={
              <Button type="button" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                New project
              </Button>
            }
          />
        </div>

        {error ? (
          <Card className="mt-8 px-6 py-12 text-center">
            <h2 className="text-sm font-semibold text-zinc-950">
              Unable to load projects
            </h2>

            <p className="mt-1 text-sm text-zinc-500">{error}</p>

            <Button variant="secondary" className="mt-5" onClick={reload}>
              Try again
            </Button>
          </Card>
        ) : projects.length === 0 ? (
          <div className="mt-8">
            <ProjectEmptyState onCreate={() => setCreateDialogOpen(true)} />
          </div>
        ) : (
          <div className="mt-8">
            <ProjectList projects={projects} organizationId={organizationId} />
          </div>
        )}

        <CreateProjectDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onCreate={async (input) => {
            await createProject(input);
          }}
        />
      </div>
    </AppShell>
  );
}
