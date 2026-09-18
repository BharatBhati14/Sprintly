"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/lib/api/errors";

import { getOrganization, getOrganizationMembers } from "./organization.api";

import type { Organization, OrganizationMember } from "./organization.types";

export function useOrganization(organizationId: string) {
  const [organization, setOrganization] = useState<Organization | null>(null);

  const [members, setMembers] = useState<OrganizationMember[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrganization = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [organizationData, membersData] = await Promise.all([
        getOrganization(organizationId),
        getOrganizationMembers(organizationId),
      ]);

      setOrganization(organizationData);
      setMembers(membersData);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Unable to load organization.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    loadOrganization();
  }, [loadOrganization]);

  return {
    organization,
    members,
    isLoading,
    error,
    reload: loadOrganization,
    refresh: loadOrganization,
  };
}
