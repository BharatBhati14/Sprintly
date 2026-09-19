import { apiClient } from "@/lib/api/client";
import type {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from "./project.types";

export async function getProjects(
  organizationId: string,
  params?: {
    page?: number;
    limit?: number;
  },
) {
  const searchParams = new URLSearchParams();

  if (params?.page) {
    searchParams.set("page", String(params.page));
  }

  if (params?.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();

  const response = await apiClient<Project[]>(
    `/api/organizations/${organizationId}/projects${query ? `?${query}` : ""}`,
    {
      method: "GET",
    },
  );

  return response;
}

export async function getProject(organizationId: string, projectId: string) {
  return apiClient<Project>(
    `/api/organizations/${organizationId}/projects/${projectId}`,
    {
      method: "GET",
    },
  );
}

export async function createProject(
  organizationId: string,
  input: CreateProjectInput,
) {
  return apiClient<Project>(`/api/organizations/${organizationId}/projects`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateProject(
  organizationId: string,
  projectId: string,
  input: UpdateProjectInput,
) {
  return apiClient<Project>(
    `/api/organizations/${organizationId}/projects/${projectId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function archiveProject(
  organizationId: string,
  projectId: string,
) {
  return apiClient<Project>(
    `/api/organizations/${organizationId}/projects/${projectId}`,
    {
      method: "POST",
    },
  );
}

export async function deleteProject(organizationId: string, projectId: string) {
  return apiClient<Project>(
    `/api/organizations/${organizationId}/projects/${projectId}`,
    {
      method: "DELETE",
    },
  );
}
