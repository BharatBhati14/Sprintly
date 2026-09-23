"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import type { Label } from "@/features/labels/label.types";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Card } from "@/components/ui";
import { Dialog } from "@/components/ui";

interface IssueLabelsProps {
  labels: Label[];
  selectedLabelIds: string[];
  loading: boolean;
  savingLabelId: string | null;
  error: string | null;
  onAdd: (labelId: string) => Promise<void>;
  onRemove: (labelId: string) => Promise<void>;
}

export function IssueLabels({
  labels,
  selectedLabelIds,
  loading,
  savingLabelId,
  error,
  onAdd,
  onRemove,
}: IssueLabelsProps) {
  const [open, setOpen] = useState(false);

  const selectedLabels = labels.filter((label) =>
    selectedLabelIds.includes(label.id),
  );

  const availableLabels = labels.filter(
    (label) => !selectedLabelIds.includes(label.id),
  );

  const handleAdd = async (labelId: string) => {
    await onAdd(labelId);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">Labels</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Organize this issue with project labels.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setOpen(true)}
          disabled={loading}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add label
        </Button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {loading ? (
          <span className="text-sm text-zinc-500">Loading labels...</span>
        ) : selectedLabels.length === 0 ? (
          <span className="text-sm text-zinc-500">No labels assigned.</span>
        ) : (
          selectedLabels.map((label) => (
            <div
              key={label.id}
              className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white pl-2.5 pr-1 py-1"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: label.color ?? "#71717a",
                }}
              />

              <span className="text-xs font-medium text-zinc-700">
                {label.name}
              </span>

              <button
                type="button"
                onClick={() => onRemove(label.id)}
                disabled={savingLabelId === label.id}
                className={cn(
                  "ml-0.5 rounded-full p-0.5 text-zinc-400",
                  "hover:bg-zinc-100 hover:text-zinc-700",
                  "disabled:pointer-events-none disabled:opacity-50",
                )}
                aria-label={`Remove ${label.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <Dialog open={open} onClose={() => setOpen}>
        <div className="p-1">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Add label</h2>

            <p className="mt-1 text-sm text-zinc-500">
              Select an existing organization label.
            </p>
          </div>

          <div className="mt-5 space-y-2">
            {availableLabels.length === 0 ? (
              <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-500">
                All available labels are already assigned.
              </p>
            ) : (
              availableLabels.map((label) => (
                <button
                  key={label.id}
                  type="button"
                  onClick={async () => {
                    await handleAdd(label.id);
                    setOpen(false);
                  }}
                  disabled={savingLabelId === label.id}
                  className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2.5 text-left transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: label.color ?? "#71717a",
                      }}
                    />

                    <span className="text-sm font-medium text-zinc-800">
                      {label.name}
                    </span>
                  </span>

                  {savingLabelId === label.id && (
                    <span className="text-xs text-zinc-400">Adding...</span>
                  )}
                </button>
              ))
            )}
          </div>

          <div className="mt-5 flex justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Dialog>
    </Card>
  );
}
