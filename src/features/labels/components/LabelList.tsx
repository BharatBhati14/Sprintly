"use client";

import { LabelCard } from "./LabelCard";

import type { Label } from "../label.types";

interface LabelListProps {
  labels: Label[];
  canManage: boolean;
  onEdit: (label: Label) => void;
  onDelete: (label: Label) => void;
}

export function LabelList({
  labels,
  canManage,
  onEdit,
  onDelete,
}: LabelListProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {labels.map((label) => (
        <LabelCard
          key={label.id}
          label={label}
          canManage={canManage}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
