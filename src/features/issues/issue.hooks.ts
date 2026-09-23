"use client";

import { useCallback, useEffect, useState } from "react";

import { createIssue, deleteIssue, getIssues, updateIssue } from "./issue.api";

import type {
  CreateIssueInput,
  Issue,
  IssueFilters,
  IssuePagination,
  UpdateIssueInput,
} from "./issue.types";

export function useIssues(organizationId: string, projectId: string) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [pagination, setPagination] = useState<IssuePagination | null>(null);
  const [filters, setFiltersState] = useState<IssueFilters>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getIssues(organizationId, projectId, filters);

      setIssues(response.data);
      setPagination(response.meta.pagination ?? null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load issues",
      );
    } finally {
      setLoading(false);
    }
  }, [organizationId, projectId, filters]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  const setFilters = useCallback((nextFilters: Partial<IssueFilters>) => {
    setFiltersState((current) => ({
      ...current,
      ...nextFilters,
      page: 1,
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFiltersState((current) => ({
      ...current,
      page,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({
      page: 1,
      limit: 20,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  }, []);

  const create = async (input: CreateIssueInput) => {
    const issue = await createIssue(organizationId, projectId, input);

    await loadIssues();

    return issue;
  };

  const update = async (issueId: string, input: UpdateIssueInput) => {
    const issue = await updateIssue(organizationId, projectId, issueId, input);

    await loadIssues();

    return issue;
  };

  const remove = async (issueId: string) => {
    await deleteIssue(organizationId, projectId, issueId);

    await loadIssues();
  };

  return {
    issues,
    pagination,
    filters,
    loading,
    error,
    setFilters,
    setPage,
    clearFilters,
    create,
    update,
    remove,
    reload: loadIssues,
    refresh: loadIssues,
  };
}
