"use client";

import { useEffect, useState } from "react";

import { Button, Dialog, Input } from "@/components/ui";

import type { Label } from "../label.types";
import { updateLabelSchema, type UpdateLabelInput } from "../label.validation";

interface EditLabelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: Label | null;
  onUpdate: (labelId: string, input: UpdateLabelInput) => Promise<void>;
}

export function EditLabelDialog({
  open,
  onOpenChange,
  label,
  onUpdate,
}: EditLabelDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (label && open) {
      setName(label.name);
      setColor(label.color ?? "#6366f1");
      setError(null);
    }
  }, [label, open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!label) return;

    const result = updateLabelSchema.safeParse({
      name,
      color,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await onUpdate(label.id, result.data);

      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update label.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      //   onOpenChange={onOpenChange}
      onClose={() => onOpenChange}
      title="Edit label"
      description="Update the label name or color."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Label name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={submitting}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900">Color</label>

          <div className="flex items-center gap-3">
            <input
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              disabled={submitting}
              className="h-10 w-12 cursor-pointer rounded-md border border-zinc-200 bg-white p-1"
            />

            <Input
              value={color}
              onChange={(event) => setColor(event.target.value)}
              disabled={submitting}
              placeholder="#6366f1"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
