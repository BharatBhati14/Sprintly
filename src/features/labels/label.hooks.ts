"use client";

import { useCallback, useEffect, useState } from "react";
import {
  attachIssueLabel,
  getIssueLabels,
  getOrganizationLabels,
  removeIssueLabel,
} from "./label.api";
import type { Label } from "./label.types";

export function useIssueLabels(
  organizationId: string,
  projectId: string,
  issueId: string,
) {
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingLabelId, setSavingLabelId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [organizationLabels, issueLabelIds] = await Promise.all([
        getOrganizationLabels(organizationId),
        getIssueLabels(organizationId, projectId, issueId),
      ]);

      setLabels(organizationLabels);
      setSelectedLabelIds(issueLabelIds);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load issue labels",
      );
    } finally {
      setLoading(false);
    }
  }, [organizationId, projectId, issueId]);

  useEffect(() => {
    load();
  }, [load]);

  const addLabel = async (labelId: string) => {
    try {
      setSavingLabelId(labelId);
      setError(null);

      await attachIssueLabel(organizationId, projectId, issueId, labelId);

      setSelectedLabelIds((current) =>
        current.includes(labelId) ? current : [...current, labelId],
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to add label");
    } finally {
      setSavingLabelId(null);
    }
  };

  const removeLabel = async (labelId: string) => {
    try {
      setSavingLabelId(labelId);
      setError(null);

      await removeIssueLabel(organizationId, projectId, issueId, labelId);

      setSelectedLabelIds((current) => current.filter((id) => id !== labelId));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to remove label",
      );
    } finally {
      setSavingLabelId(null);
    }
  };

  return {
    labels,
    selectedLabelIds,
    loading,
    savingLabelId,
    error,
    addLabel,
    removeLabel,
    reload: load,
  };
}
