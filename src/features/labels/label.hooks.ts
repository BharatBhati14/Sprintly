"use client";

import { useCallback, useEffect, useState } from "react";
import {
  attachIssueLabel,
  createOrganizationLabel,
  deleteOrganizationLabel,
  getIssueLabels,
  getOrganizationLabels,
  removeIssueLabel,
  updateOrganizationLabel,
} from "./label.api";
import type { Label } from "./label.types";
import type { CreateLabelInput, UpdateLabelInput } from "./label.validation";

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

export function useOrganizationLabels(organizationId: string) {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLabels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getOrganizationLabels(organizationId);

      setLabels(result);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load labels",
      );
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    loadLabels();
  }, [loadLabels]);

  const createLabel = useCallback(
    async (input: CreateLabelInput) => {
      try {
        setError(null);

        await createOrganizationLabel(organizationId, input);

        await loadLabels();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create label.";

        setError(message);
        throw err;
      }
    },
    [organizationId, loadLabels],
  );

  const updateLabel = useCallback(
    async (labelId: string, input: UpdateLabelInput) => {
      try {
        setError(null);

        await updateOrganizationLabel(organizationId, labelId, input);

        await loadLabels();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update label.";

        setError(message);
        throw err;
      }
    },
    [organizationId, loadLabels],
  );

  const deleteLabel = useCallback(
    async (labelId: string) => {
      try {
        setError(null);

        await deleteOrganizationLabel(organizationId, labelId);

        await loadLabels();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete label.";

        setError(message);
        throw err;
      }
    },
    [organizationId, loadLabels],
  );

  return {
    labels,
    loading,
    error,
    createLabel,
    updateLabel,
    deleteLabel,
    reload: loadLabels,
  };
}
