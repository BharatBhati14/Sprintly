"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Badge, Card } from "@/components/ui";

import type { Label } from "../label.types";

interface LabelCardProps {
  label: Label;
  canManage: boolean;
  onEdit: (label: Label) => void;
  onDelete: (label: Label) => void;
}

export function LabelCard({
  label,
  canManage,
  onEdit,
  onDelete,
}: LabelCardProps) {
  return (
    <Card className="relative">
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="flex min-w-0 items-center gap-5">
          <span
            className="h-4 w-4 shrink-0 rounded-full"
            style={{
              backgroundColor: label.color ?? "#a1a1aa",
            }}
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{label.name}</Badge>
            </div>

            <p className="mt-1 text-xs text-zinc-500">
              {label.color ?? "Default color"}
            </p>
          </div>
        </div>

        {canManage && (
          <div className="relative">
            <details className="group">
              <summary
                className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                aria-label={`Actions for ${label.name}`}
              >
                <MoreVertical className="h-4 w-4" />
              </summary>

              <div className="absolute right-0 top-9 z-20 w-36 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => onEdit(label)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-zinc-700 transition hover:bg-zinc-100"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(label)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </details>
          </div>
        )}
      </div>
    </Card>
  );
}
