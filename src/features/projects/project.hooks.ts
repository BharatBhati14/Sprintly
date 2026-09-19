"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/errors";
import {
  createProject as createProjectApi,
  deleteProject as deleteProjectApi,
  getProjects,
} from "./project.api";
import type { CreateProjectInput, Project } from "./project.types";

export function useProjects(organizationId: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getProjects(organizationId);
      setProjects(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Unable to load projects.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [organizationId]);

  const createProject = useCallback(
    async (input: CreateProjectInput) => {
      const project = await createProjectApi(organizationId, input);

      setProjects((current) => [project, ...current]);

      return project;
    },
    [organizationId],
  );

  const deleteProject = useCallback(
    async (projectId: string) => {
      await deleteProjectApi(organizationId, projectId);

      setProjects((current) =>
        current.filter((project) => project.id !== projectId),
      );
    },
    [organizationId],
  );

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    isLoading,
    error,
    reload: loadProjects,
    refresh: loadProjects,
    createProject,
    deleteProject,
  };
}
