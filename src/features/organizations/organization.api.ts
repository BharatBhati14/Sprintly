import { apiClient } from "@/lib/api/client";

import type {
  CreateOrganizationInput,
  Organization,
  OrganizationMember,
  UpdateMemberRoleInput,
  UpdateOrganizationInput,
} from "./organization.types";

export interface CreateInvitationInput {
  email: string;
}

export interface OrganizationInvitation {
  id: string;
  organizationId: string;
  email: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export async function getOrganizations(): Promise<Organization[]> {
  return apiClient<Organization[]>("/api/organizations", {
    method: "GET",
  });
}

export async function getOrganization(
  organizationId: string,
): Promise<Organization> {
  return apiClient<Organization>(`/api/organizations/${organizationId}`, {
    method: "GET",
  });
}

export async function createOrganization(
  input: CreateOrganizationInput,
): Promise<Organization> {
  return apiClient<Organization>("/api/organizations", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateOrganization(
  organizationId: string,
  input: UpdateOrganizationInput,
): Promise<Organization> {
  return apiClient<Organization>(`/api/organizations/${organizationId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function getOrganizationMembers(
  organizationId: string,
): Promise<OrganizationMember[]> {
  return apiClient<OrganizationMember[]>(
    `/api/organizations/${organizationId}/members`,
    {
      method: "GET",
    },
  );
}

export async function updateMemberRole(
  organizationId: string,
  userId: string,
  input: UpdateMemberRoleInput,
): Promise<OrganizationMember> {
  return apiClient<OrganizationMember>(
    `/api/organizations/${organizationId}/members/${userId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function removeMember(
  organizationId: string,
  userId: string,
): Promise<void> {
  await apiClient<void>(
    `/api/organizations/${organizationId}/members/${userId}`,
    {
      method: "DELETE",
    },
  );
}

export async function createOrganizationInvitation(
  organizationId: string,
  input: CreateInvitationInput,
): Promise<OrganizationInvitation> {
  const response = await apiClient<{
    invitation: OrganizationInvitation;
  }>(`/api/organizations/${organizationId}/invitations`, {
    method: "POST",
    body: JSON.stringify(input),
  });

  return response.invitation;
}

export async function deleteOrganization(
  organizationId: string,
): Promise<Organization> {
  return apiClient<Organization>(`/api/organizations/${organizationId}`, {
    method: "DELETE",
  });
}
