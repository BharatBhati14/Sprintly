"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button, Dialog, useToast } from "@/components/ui";
import type { Project } from "../project.types";

interface DeleteProjectDialogProps {
  project: Project;
  open: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

export function DeleteProjectDialog({
  project,
  open,
  onClose,
  onDelete,
}: DeleteProjectDialogProps) {
  const { toast } = useToast();
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete = confirmation === project.name;

  const handleClose = () => {
    if (isDeleting) return;

    setConfirmation("");
    setError(null);
    onClose();
  };

  const handleDelete = async () => {
    if (!canDelete) return;

    setError(null);

    try {
      setIsDeleting(true);
      await onDelete();

      toast({
        type: "success",
        title: "Project deleted",
        message: "Project was deleted successfully.",
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to delete project.",
      );
      toast({
        type: "error",
        title: "Failed to delete project",
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Delete project"
      description="This action cannot be undone."
    >
      <div className="space-y-5">
        <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

          <div className="text-sm text-red-800">
            <p className="font-medium">Permanently delete this project?</p>

            <p className="mt-1">
              All project data, including its issues and project memberships,
              may be deleted with it.
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="project-delete-confirmation"
            className="mb-1.5 block text-sm font-medium text-zinc-800"
          >
            Type <span className="font-semibold">{project.name}</span> to
            confirm
          </label>

          <input
            id="project-delete-confirmation"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            disabled={isDeleting}
            className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            loading={isDeleting}
            disabled={!canDelete}
            onClick={handleDelete}
          >
            Delete project
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
