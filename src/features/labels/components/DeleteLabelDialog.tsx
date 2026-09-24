"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button, Dialog } from "@/components/ui";
import type { Label } from "../label.types";

interface DeleteLabelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: Label | null;
  onDelete: (labelId: string) => Promise<void>;
}

export function DeleteLabelDialog({
  open,
  onOpenChange,
  label,
  onDelete,
}: DeleteLabelDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!label) return;

    try {
      setDeleting(true);
      setError(null);

      await onDelete(label.id);

      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete label.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog
      open={open}
      //   onOpenChange={onOpenChange}
      onClose={() => onOpenChange}
      title="Delete label"
      description="This action cannot be undone."
    >
      <div className="space-y-5">
        <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

          <div>
            <p className="text-sm font-medium text-red-900">
              Delete "{label?.name}"?
            </p>

            <p className="mt-1 text-sm text-red-700">
              The label will be removed from the organization and its issue
              associations.
            </p>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete label"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
