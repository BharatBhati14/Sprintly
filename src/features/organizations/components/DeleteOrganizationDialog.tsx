"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui";
import { Button, Dialog, Input } from "@/components/ui";
import { ApiError } from "@/lib/api/errors";

interface DeleteOrganizationDialogProps {
  open: boolean;
  organizationName: string;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

export function DeleteOrganizationDialog({
  open,
  organizationName,
  onClose,
  onDelete,
}: DeleteOrganizationDialogProps) {
  const { toast } = useToast();
  const [confirmation, setConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDelete = confirmation === organizationName;

  const handleDelete = async () => {
    if (!canDelete || isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);

      await onDelete();

      toast({
        type: "success",
        title: "Organization deleted",
        message: "Your organization was deleted successfully.",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Unable to delete organization.");
      }
      toast({
        type: "error",
        title: "Failed to delete organization",
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      });

      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (isDeleting) {
      return;
    }

    setConfirmation("");
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Delete organization"
      description="This action cannot be undone."
    >
      <div className="space-y-5">
        <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

          <div className="text-sm">
            <p className="font-medium text-red-900">
              Permanently delete this organization?
            </p>

            <p className="mt-1 leading-5 text-red-700">
              All projects, issues, members, labels, and invitations associated
              with this organization may be deleted as well.
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="delete-organization-confirmation"
            className="mb-2 block text-sm font-medium text-zinc-900"
          >
            Type <span className="font-semibold">{organizationName}</span> to
            confirm
          </label>

          <Input
            id="delete-organization-confirmation"
            value={confirmation}
            onChange={(event) => {
              setConfirmation(event.target.value);
              setError(null);
            }}
            disabled={isDeleting}
            placeholder={organizationName}
          />
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            disabled={!canDelete || isDeleting}
            loading={isDeleting}
            onClick={handleDelete}
          >
            {!isDeleting && <Trash2 className="h-4 w-4" />}
            Delete organization
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
