"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/errors";
import {
  addProjectMember,
  getProjectMembers,
  removeProjectMember,
} from "./project-member.api";
import type { ProjectMember } from "./project-member.types";

export function useProjectMembers(organizationId: string, projectId: string) {
  const [members, setMembers] = useState<ProjectMember[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getProjectMembers(organizationId, projectId);

      setMembers(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Unable to load project members.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [organizationId, projectId]);

  const addMember = async (userId: string) => {
    setError(null);

    try {
      await addProjectMember(organizationId, projectId, { userId });

      await loadMembers();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add project member";

      setError(message);
      throw error;
    }
  };

  const removeMember = useCallback(
    async (userId: string) => {
      await removeProjectMember(organizationId, projectId, userId);

      setMembers((current) =>
        current.filter((member) => member.userId !== userId),
      );
    },
    [organizationId, projectId],
  );

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  return {
    members,
    isLoading,
    error,
    reload: loadMembers,
    refresh: loadMembers,
    addMember,
    removeMember,
  };
}
