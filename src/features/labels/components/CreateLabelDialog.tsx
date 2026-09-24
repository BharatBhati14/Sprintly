"use client";

import { useEffect, useState } from "react";

import { Button, Dialog, Input } from "@/components/ui";

import { labelSchema, type CreateLabelInput } from "../label.validation";

interface CreateLabelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (input: CreateLabelInput) => Promise<void>;
}

export function CreateLabelDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateLabelDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setName("");
      setColor("#6366f1");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = labelSchema.safeParse({
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

      await onCreate(result.data);

      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create label.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      //   onOpenChange={onOpenChange}
      onClose={() => onOpenChange}
      title="Create label"
      description="Create a label that can be used across this organization."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Label name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g., Bug"
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
              placeholder="#6366f1"
              disabled={submitting}
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
            {submitting ? "Creating..." : "Create label"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
