"use client";

import { Tags } from "lucide-react";

import { Button, Card } from "@/components/ui";

interface LabelEmptyStateProps {
  canManage: boolean;
  onCreate: () => void;
}

export function LabelEmptyState({ canManage, onCreate }: LabelEmptyStateProps) {
  return (
    <Card>
      <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
          <Tags className="h-5 w-5 text-zinc-500" />
        </div>

        <h3 className="text-sm font-semibold text-zinc-900">No labels yet</h3>

        <p className="mt-1 max-w-sm text-sm text-zinc-500">
          Create labels to organize and categorize issues across this
          organization.
        </p>

        {canManage && (
          <Button className="mt-5" onClick={onCreate}>
            Create label
          </Button>
        )}
      </div>
    </Card>
  );
}
