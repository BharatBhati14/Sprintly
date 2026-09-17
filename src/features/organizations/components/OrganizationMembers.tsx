"use client";

import { useState } from "react";
import { Loader2, MoreVertical, Shield, Trash2 } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";

import type {
  OrganizationMember,
  OrganizationRole,
} from "../organization.types";
import { OrganizationRoleBadge } from "./OrganizationRoleBadge";

interface OrganizationMembersProps {
  members: OrganizationMember[];
  currentUserId: string;
  currentUserRole: OrganizationRole;
  onRoleChange: (userId: string, role: OrganizationRole) => Promise<void>;
  onRemove: (userId: string) => Promise<void>;
}

const roles: OrganizationRole[] = ["ADMIN", "MEMBER", "VIEWER"];

export function OrganizationMembers({
  members,
  currentUserId,
  currentUserRole,
  onRoleChange,
  onRemove,
}: OrganizationMembersProps) {
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null);

  const canManageMembers =
    currentUserRole === "OWNER" || currentUserRole === "ADMIN";

  const handleRoleChange = async (userId: string, role: OrganizationRole) => {
    try {
      setLoadingUserId(userId);
      setOpenMenuUserId(null);

      await onRoleChange(userId, role);
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleRemove = async (userId: string) => {
    const member = members.find((item) => item.userId === userId);

    if (!member) return;

    const confirmed = window.confirm(
      `Remove ${member.name || member.email} from this organization?`,
    );

    if (!confirmed) return;

    try {
      setLoadingUserId(userId);
      setOpenMenuUserId(null);

      await onRemove(userId);
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-zinc-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-950">Members</h2>

            <p className="mt-1 text-sm text-zinc-500">
              People who have access to this organization.
            </p>
          </div>

          <Badge variant="secondary">{members.length}</Badge>
        </div>
      </div>

      <div className="divide-y divide-zinc-100">
        {members.map((member) => {
          const isCurrentUser = member.userId === currentUserId;
          const isOwner = member.role === "OWNER";
          const isLoading = loadingUserId === member.userId;

          const canEdit = canManageMembers && !isCurrentUser && !isOwner;

          return (
            <div
              key={member.userId}
              className="flex items-center justify-between gap-4 px-6 py-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium text-zinc-700">
                  {(member.name || member.email).charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="truncate text-sm font-medium text-zinc-950">
                      {member.name || "Unnamed user"}
                    </p>

                    {isCurrentUser && <Badge variant="secondary">You</Badge>}
                  </div>

                  <p className="truncate text-sm text-zinc-500">
                    {member.email}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <OrganizationRoleBadge role={member.role} />

                {canEdit && (
                  <div className="relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isLoading}
                      onClick={(event) => {
                        event.stopPropagation();

                        setOpenMenuUserId((current) =>
                          current === member.userId ? null : member.userId,
                        );
                      }}
                      aria-label={`Manage ${member.name || member.email}`}
                      aria-expanded={openMenuUserId === member.userId}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MoreVertical className="h-4 w-4" />
                      )}
                    </Button>

                    {openMenuUserId === member.userId && (
                      <div
                        className="absolute right-0 top-full z-50 mt-2 w-52 rounded-lg border border-zinc-200 bg-white p-1 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <div className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                          Change role
                        </div>

                        {roles.map((role) => (
                          <button
                            key={role}
                            type="button"
                            disabled={member.role === role || isLoading}
                            onClick={() =>
                              handleRoleChange(member.userId, role)
                            }
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-default disabled:opacity-40"
                          >
                            <Shield className="h-4 w-4" />

                            {role.charAt(0) + role.slice(1).toLowerCase()}
                          </button>
                        ))}

                        <div className="my-1 border-t border-zinc-100" />

                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => handleRemove(member.userId)}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove member
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
