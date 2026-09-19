import { apiClient } from "@/lib/api/client";
import type {
  AddProjectMemberInput,
  ProjectMember,
} from "./project-member.types";

export async function getProjectMembers(
  organizationId: string,
  projectId: string,
) {
  return apiClient<ProjectMember[]>(
    `/api/organizations/${organizationId}/projects/${projectId}/members`,
    {
      method: "GET",
    },
  );
}

export async function addProjectMember(
  organizationId: string,
  projectId: string,
  input: AddProjectMemberInput,
) {
  return apiClient<ProjectMember>(
    `/api/organizations/${organizationId}/projects/${projectId}/members`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function removeProjectMember(
  organizationId: string,
  projectId: string,
  userId: string,
) {
  return apiClient<ProjectMember>(
    `/api/organizations/${organizationId}/projects/${projectId}/members/${userId}`,
    {
      method: "DELETE",
    },
  );
}
