"use client";

import { useCallback, useEffect, useState } from "react";

import { createIssue, deleteIssue, getIssues, updateIssue } from "./issue.api";

import type {
  CreateIssueInput,
  Issue,
  IssuePagination,
  UpdateIssueInput,
} from "./issue.types";

export function useIssues(organizationId: string, projectId: string) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [pagination, setPagination] = useState<IssuePagination | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getIssues(organizationId, projectId);

      setIssues(response.data);
      setPagination(response.meta.pagination ?? null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load issues",
      );
    } finally {
      setLoading(false);
    }
  }, [organizationId, projectId]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  const create = async (input: CreateIssueInput) => {
    const response = await createIssue(organizationId, projectId, input);

    setIssues((current) => [response, ...current]);

    return response;
  };

  const update = async (issueId: string, input: UpdateIssueInput) => {
    const response = await updateIssue(
      organizationId,
      projectId,
      issueId,
      input,
    );

    setIssues((current) =>
      current.map((issue) => (issue.id === issueId ? response : issue)),
    );

    return response;
  };

  const remove = async (issueId: string) => {
    await deleteIssue(organizationId, projectId, issueId);

    setIssues((current) => current.filter((issue) => issue.id !== issueId));
  };

  return {
    issues,
    pagination,
    loading,
    error,
    create,
    update,
    remove,
    reload: loadIssues,
    refresh: loadIssues,
  };
}
