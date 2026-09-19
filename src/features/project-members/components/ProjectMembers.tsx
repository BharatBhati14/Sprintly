"use client";

import { MoreVertical, UserPlus, Users } from "lucide-react";
import { useState } from "react";

import { Avatar, Badge, Button, Card, Skeleton } from "@/components/ui";

import type { ProjectMember } from "../project-member.types";

interface ProjectMembersProps {
  members: ProjectMember[];
  isLoading: boolean;
  error: string | null;
  canManage: boolean;
  onAdd: () => void;
  onRemove: (userId: string) => Promise<void>;
  onRetry: () => void;
}

export function ProjectMembers({
  members,
  isLoading,
  error,
  canManage,
  onAdd,
  onRemove,
  onRetry,
}: ProjectMembersProps) {
  const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null);

  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const handleRemove = async (userId: string) => {
    const confirmed = window.confirm("Remove this member from the project?");

    if (!confirmed) return;

    try {
      setLoadingUserId(userId);
      setOpenMenuUserId(null);

      await onRemove(userId);
    } finally {
      setLoadingUserId(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-9 w-28" />
        </div>

        <div className="mt-5 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-zinc-500">{error}</p>

        <Button variant="secondary" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-zinc-500" />

            <h2 className="text-sm font-semibold text-zinc-950">
              Project members
            </h2>

            <Badge variant="secondary">{members.length}</Badge>
          </div>

          <p className="mt-1 text-sm text-zinc-500">
            People who have access to this project.
          </p>
        </div>

        {canManage && (
          <Button size="sm" onClick={onAdd}>
            <UserPlus className="h-4 w-4" />
            Add member
          </Button>
        )}
      </div>

      {members.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-zinc-500">No project members.</p>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-zinc-100">
          {members.map((member) => (
            <div
              key={member.userId}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={member.name} />

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-950">
                    {member.name}
                  </p>

                  <p className="truncate text-xs text-zinc-500">
                    {member.email}
                  </p>
                </div>
              </div>

              {canManage && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Actions for ${member.name}`}
                    disabled={loadingUserId === member.userId}
                    onClick={() =>
                      setOpenMenuUserId((current) =>
                        current === member.userId ? null : member.userId,
                      )
                    }
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>

                  {openMenuUserId === member.userId && (
                    <div className="absolute right-0 top-10 z-20 w-40 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg">
                      <button
                        type="button"
                        className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                        onClick={() => handleRemove(member.userId)}
                      >
                        Remove member
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
