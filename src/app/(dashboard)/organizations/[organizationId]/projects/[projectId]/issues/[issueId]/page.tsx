"use client";

import Link from "next/link";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout";
import { Button, Card } from "@/components/ui";
import { ProjectShell } from "@/features/projects/components";
import {
  IssueDetail,
  EditIssueDialog,
  IssuePriorityBadge,
  IssueStatusBadge,
} from "@/features/issues/components";
import { useIssue } from "@/features/issues/useIssue";
import { useProject } from "@/features/projects/useProject";
import type { UpdateIssueInput } from "@/features/issues/issue.types";
import { useState } from "react";

export default function IssueDetailPage() {
  const params = useParams<{
    organizationId: string;
    projectId: string;
    issueId: string;
  }>();

  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);

  const { organizationId, projectId, issueId } = params;

  const {
    project,
    isLoading: projectLoading,
    error: projectError,
  } = useProject(organizationId, projectId);

  const {
    issue,
    loading: issueLoading,
    error: issueError,
    update,
    remove,
  } = useIssue(organizationId, projectId, issueId);

  const handleUpdate = async (input: UpdateIssueInput) => {
    await update(input);
  };

  const handleDelete = async () => {
    if (!issue) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this issue?",
    );

    if (!confirmed) return;

    try {
      await remove();

      router.replace(
        `/organizations/${organizationId}/projects/${projectId}/issues`,
      );
    } catch (error) {
      console.error("Failed to delete issue:", error);
    }
  };

  if (projectLoading || issueLoading) {
    return (
      <AppShell>
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded bg-zinc-100" />
          <div className="h-64 animate-pulse rounded-xl bg-zinc-100" />
        </div>
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

  if (issueError || !issue) {
    return (
      <AppShell>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {issueError || "Issue not found"}
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
        <div className="space-y-6 px-4 md:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link
              href={`/organizations/${organizationId}/projects/${projectId}/issues`}
              className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-950"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to issues
            </Link>

            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => setEditOpen(true)}>
                <Pencil className="h-4 w-4" />
                Edit
              </Button>

              <Button variant="danger" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          <IssueDetail issue={issue} projectKey={project.key} />

          <EditIssueDialog
            issue={issue}
            open={editOpen}
            onOpenChange={setEditOpen}
            onSave={handleUpdate}
          />
        </div>
      </ProjectShell>
    </AppShell>
  );
}
