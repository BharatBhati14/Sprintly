"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/lib/api/errors";

import { createOrganization, getOrganizations } from "./organization.api";

import type {
  CreateOrganizationInput,
  Organization,
} from "./organization.types";

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrganizations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getOrganizations();
      setOrganizations(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Unable to load organizations.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  const addOrganization = useCallback(
    async (input: CreateOrganizationInput) => {
      const organization = await createOrganization(input);

      setOrganizations((current) => [organization, ...current]);

      return organization;
    },
    [],
  );

  return {
    organizations,
    isLoading,
    error,
    reload: loadOrganizations,
    addOrganization,
  };
}
