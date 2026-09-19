"use client";

import { useMemo, useState } from "react";
import { Dialog, Button } from "@/components/ui";
import type { OrganizationMember } from "@/features/organizations/organization.types";

interface AddProjectMemberDialogProps {
  open: boolean;
  onClose: () => void;
  organizationMembers: OrganizationMember[];
  projectMemberIds: string[];
  onAdd: (userId: string) => Promise<void | unknown>;
}

export function AddProjectMemberDialog({
  open,
  onClose,
  organizationMembers,
  projectMemberIds,
  onAdd,
}: AddProjectMemberDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const availableMembers = useMemo(
    () =>
      organizationMembers.filter(
        (member) => !projectMemberIds.includes(member.userId),
      ),
    [organizationMembers, projectMemberIds],
  );

  const handleClose = () => {
    if (isAdding) return;

    setSelectedUserId("");
    setError(null);
    onClose();
  };

  const handleAdd = async () => {
    if (!selectedUserId) {
      setError("Select a member.");
      return;
    }

    try {
      setError(null);
      setIsAdding(true);

      await onAdd(selectedUserId);

      handleClose();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to add member.",
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Add project member"
      description="Choose an existing organization member."
    >
      <div className="space-y-5">
        {availableMembers.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-5 text-center">
            <p className="text-sm font-medium text-zinc-950">
              Everyone is already a member
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              There are no organization members available to add.
            </p>
          </div>
        ) : (
          <div>
            <label
              htmlFor="project-member"
              className="mb-1.5 block text-sm font-medium text-zinc-800"
            >
              Organization member
            </label>

            <select
              id="project-member"
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
              disabled={isAdding}
              className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
            >
              <option value="">Select a member</option>

              {availableMembers.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.name} — {member.email}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isAdding}
          >
            Cancel
          </Button>

          <Button
            type="button"
            loading={isAdding}
            disabled={availableMembers.length === 0 || !selectedUserId}
            onClick={handleAdd}
          >
            Add member
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
