"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/errors";
import {
  archiveProject as archiveProjectApi,
  deleteProject as deleteProjectApi,
  getProject,
  updateProject as updateProjectApi,
} from "./project.api";
import type { Project, UpdateProjectInput } from "./project.types";

export function useProject(organizationId: string, projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProject = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getProject(organizationId, projectId);

      setProject(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Unable to load project.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [organizationId, projectId]);

  const updateProject = useCallback(
    async (input: UpdateProjectInput) => {
      const updated = await updateProjectApi(organizationId, projectId, input);

      setProject(updated);

      return updated;
    },
    [organizationId, projectId],
  );

  const archiveProject = useCallback(async () => {
    const archived = await archiveProjectApi(organizationId, projectId);

    setProject(archived);

    return archived;
  }, [organizationId, projectId]);

  const deleteProject = useCallback(async () => {
    await deleteProjectApi(organizationId, projectId);
  }, [organizationId, projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  return {
    project,
    isLoading,
    error,
    reload: loadProject,
    refresh: loadProject,
    updateProject,
    archiveProject,
    deleteProject,
  };
}
