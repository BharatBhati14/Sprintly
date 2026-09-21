"use client";

import { useCallback, useEffect, useState } from "react";

import { deleteIssue, getIssue, updateIssue } from "./issue.api";

import type { Issue, UpdateIssueInput } from "./issue.types";

export function useIssue(
  organizationId: string,
  projectId: string,
  issueId: string,
) {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadIssue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getIssue(organizationId, projectId, issueId);

      setIssue(response);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load issue");
    } finally {
      setLoading(false);
    }
  }, [organizationId, projectId, issueId]);

  useEffect(() => {
    loadIssue();
  }, [loadIssue]);

  const update = async (input: UpdateIssueInput) => {
    const response = await updateIssue(
      organizationId,
      projectId,
      issueId,
      input,
    );

    setIssue(response);

    return response;
  };

  const remove = async () => {
    await deleteIssue(organizationId, projectId, issueId);
  };

  return {
    issue,
    loading,
    error,
    update,
    remove,
    reload: loadIssue,
    refresh: loadIssue,
  };
}
