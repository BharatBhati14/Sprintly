import { apiClient } from "@/lib/api/client";

import type {
  CreateIssueInput,
  Issue,
  IssueFilters,
  IssuePagination,
  IssueStatus,
  UpdateIssueInput,
} from "./issue.types";

interface IssueListResponse {
  issues: Issue[];
  pagination: IssuePagination;
}

export async function getIssues(
  organizationId: string,
  projectId: string,
  filters?: IssueFilters,
) {
  const params = new URLSearchParams();

  if (filters?.status) {
    params.set("status", filters.status);
  }

  if (filters?.priority) {
    params.set("priority", filters.priority);
  }

  if (filters?.assigneeId) {
    params.set("assigneeId", filters.assigneeId);
  }

  if (filters?.page) {
    params.set("page", String(filters.page));
  }

  if (filters?.limit) {
    params.set("limit", String(filters.limit));
  }

  const query = params.toString();

  return apiClient<IssueListResponse>(
    `/api/organizations/${organizationId}/projects/${projectId}/issues${
      query ? `?${query}` : ""
    }`,
  );
}

export async function getIssue(
  organizationId: string,
  projectId: string,
  issueId: string,
) {
  return apiClient<Issue>(
    `/api/organizations/${organizationId}/projects/${projectId}/issues/${issueId}`,
  );
}

export async function createIssue(
  organizationId: string,
  projectId: string,
  input: CreateIssueInput,
) {
  return apiClient<Issue>(
    `/api/organizations/${organizationId}/projects/${projectId}/issues`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function updateIssue(
  organizationId: string,
  projectId: string,
  issueId: string,
  input: UpdateIssueInput,
) {
  return apiClient<Issue>(
    `/api/organizations/${organizationId}/projects/${projectId}/issues/${issueId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function updateIssueStatus(
  organizationId: string,
  projectId: string,
  issueId: string,
  status: IssueStatus,
) {
  return apiClient<Issue>(
    `/api/organizations/${organizationId}/projects/${projectId}/issues/${issueId}/status`,
    {
      method: "PATCH",
      body: status,
    },
  );
}

export async function deleteIssue(
  organizationId: string,
  projectId: string,
  issueId: string,
) {
  return apiClient<Issue>(
    `/api/organizations/${organizationId}/projects/${projectId}/issues/${issueId}`,
    {
      method: "DELETE",
    },
  );
}
