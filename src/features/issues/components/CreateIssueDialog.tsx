"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Button, Input, Textarea, useToast } from "@/components/ui";
import { createIssueSchema, IssueStatus } from "../issue.validation";
import type { CreateIssueInput, IssuePriority } from "../issue.types";

interface CreateIssueDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: CreateIssueInput) => Promise<void>;
}

const priorities: IssuePriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const statuses: IssueStatus[] = [
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
];

export function CreateIssueDialog({
  open,
  onClose,
  onCreate,
}: CreateIssueDialogProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<IssuePriority>("MEDIUM");
  const [status, setStatus] = useState<IssueStatus>("TODO");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!open) {
    return null;
  }

  const reset = () => {
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setStatus("TODO");
    setError(null);
  };

  const handleClose = () => {
    if (submitting) {
      return;
    }

    reset();
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    const result = createIssueSchema.safeParse({
      title,
      description: description || undefined,
      priority,
      status,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setSubmitting(true);

    try {
      await onCreate({
        title: result.data.title,
        description: result.data.description,
        priority: result.data.priority,
        status: result.data.status,
      });
      toast({
        type: "success",
        title: "issue created",
        message: "Issue was created successfully.",
      });

      reset();
      onClose();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create issue",
      );
      toast({
        type: "error",
        title: "Failed to create issue",
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-zinc-950">Create issue</h2>

            <p className="mt-1 text-xs text-zinc-500">
              Add a new piece of work to this project.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <Input
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Implement project dashboard"
            disabled={submitting}
            autoFocus
          />

          <Textarea
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe what needs to be done..."
            rows={5}
            disabled={submitting}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-800">
              Priority
            </label>

            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as IssuePriority)
              }
              disabled={submitting}
              className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 disabled:cursor-not-allowed disabled:bg-zinc-50"
            >
              {priorities.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0) + item.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-800">Status</label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as IssueStatus)}
              disabled={submitting}
              className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 disabled:cursor-not-allowed disabled:bg-zinc-50"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0) + item.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create issue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
