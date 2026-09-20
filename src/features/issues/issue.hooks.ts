"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createIssue,
  deleteIssue,
  getIssue,
  getIssues,
  updateIssue,
  updateIssueStatus,
} from "./issue.api";

import type {
  CreateIssueInput,
  Issue,
  IssueFilters,
  IssuePagination,
  IssueStatus,
  UpdateIssueInput,
} from "./issue.types";

export function useIssues(
  organizationId: string,
  projectId: string,
  filters?: IssueFilters,
) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [pagination, setPagination] = useState<IssuePagination | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadIssues = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getIssues(organizationId, projectId, filters);

      setIssues(response.issues);
      setPagination(response.pagination);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load issues";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [organizationId, projectId, filters]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  const create = async (input: CreateIssueInput) => {
    const issue = await createIssue(organizationId, projectId, input);

    setIssues((current) => [issue, ...current]);

    return issue;
  };

  const update = async (issueId: string, input: UpdateIssueInput) => {
    const updatedIssue = await updateIssue(
      organizationId,
      projectId,
      issueId,
      input,
    );

    setIssues((current) =>
      current.map((issue) => (issue.id === issueId ? updatedIssue : issue)),
    );

    return updatedIssue;
  };

  const updateStatus = async (issueId: string, status: IssueStatus) => {
    const updatedIssue = await updateIssueStatus(
      organizationId,
      projectId,
      issueId,
      status,
    );

    setIssues((current) =>
      current.map((issue) => (issue.id === issueId ? updatedIssue : issue)),
    );

    return updatedIssue;
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
    updateStatus,
    remove,
    reload: loadIssues,
    refresh: loadIssues,
  };
}

export function useIssue(
  organizationId: string,
  projectId: string,
  issueId: string,
) {
  const [issue, setIssue] = useState<Issue | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadIssue = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getIssue(organizationId, projectId, issueId);

      setIssue(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load issue";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [organizationId, projectId, issueId]);

  useEffect(() => {
    loadIssue();
  }, [loadIssue]);

  return {
    issue,
    loading,
    error,
    reload: loadIssue,
    refresh: loadIssue,
  };
}
