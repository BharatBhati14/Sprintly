"use client";

import { useEffect, useState } from "react";
import { Button, Dialog, Input, Textarea, useToast } from "@/components/ui";
import type { Issue, IssuePriority, IssueStatus } from "../issue.types";
import { ProjectMember } from "@/features/project-members/project-member.types";

interface EditIssueDialogProps {
  issue: Issue;
  projectMembers: ProjectMember[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (input: {
    title: string;
    description: string | null;
    status: IssueStatus;
    priority: IssuePriority;
    assigneeId: string | null;
    dueDate: string | null;
  }) => Promise<void>;
}

const statuses: IssueStatus[] = [
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
];

const priorities: IssuePriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export function EditIssueDialog({
  issue,
  open,
  onOpenChange,
  onSave,
  projectMembers,
}: EditIssueDialogProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.desc ?? "");
  const [status, setStatus] = useState<IssueStatus>(issue.status);
  const [priority, setPriority] = useState<IssuePriority>(issue.priority);
  const [dueDate, setDueDate] = useState(
    issue.dueDate ? issue.dueDate.slice(0, 10) : "",
  );
  const [assigneeId, setAssigneeId] = useState<string | null>(issue.assigneeId);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setTitle(issue.title);
    setDescription(issue.desc ?? "");
    setStatus(issue.status);
    setPriority(issue.priority);
    setDueDate(issue.dueDate ? issue.dueDate.slice(0, 10) : "");
    setAssigneeId(issue.assigneeId);
    setError(null);
  }, [issue, open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await onSave({
        title: title.trim(),
        description: description.trim() ? description.trim() : null,
        status,
        priority,
        dueDate: dueDate || null,
        assigneeId,
      });
      toast({
        type: "success",
        title: "Issue updated",
        message: "Issue was updated successfully.",
      });

      onOpenChange(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update issue.",
      );
      toast({
        type: "error",
        title: "Failed to update issue",
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      // onOpenChange={false}
      onClose={() => onOpenChange}
      title="Edit issue"
      description="Update the issue details and workflow state."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <Input
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Issue title"
          disabled={saving}
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the issue..."
          rows={6}
          disabled={saving}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-900">
              Status
            </label>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as IssueStatus)}
              disabled={saving}
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
            >
              {statuses.map((value) => (
                <option key={value} value={value}>
                  {value.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-900">
              Priority
            </label>

            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as IssuePriority)
              }
              disabled={saving}
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
            >
              {priorities.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-900">
              Assignee
            </label>

            <select
              value={assigneeId ?? ""}
              onChange={(event) => setAssigneeId(event.target.value || null)}
              disabled={saving}
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
            >
              <option value="">Unassigned</option>

              {projectMembers.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Due date"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          disabled={saving}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
