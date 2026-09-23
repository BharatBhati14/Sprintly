import { apiClient } from "@/lib/api/client";

import type {
  CreateIssueInput,
  Issue,
  IssueFilters,
  IssuePagination,
  IssueStatus,
  UpdateIssueInput,
} from "./issue.types";

export interface IssueListResponse {
  data: Issue[];
}

interface IssueListApiResponse {
  data: Issue[];
  meta: {
    pagination?: IssuePagination;
  };
}

export async function getIssues(
  organizationId: string,
  projectId: string,
  filters?: IssueFilters,
) {
  const searchParams = new URLSearchParams();

  if (filters?.status) {
    searchParams.set("status", filters.status);
  }

  if (filters?.priority) {
    searchParams.set("priority", filters.priority);
  }

  if (filters?.assigneeId) {
    searchParams.set("assigneeId", filters.assigneeId);
  }

  if (filters?.unassigned) {
    searchParams.set("unassigned", "true");
  }

  if (filters?.labelId) {
    searchParams.set("labelId", filters.labelId);
  }

  if (filters?.page) {
    searchParams.set("page", String(filters.page));
  }

  if (filters?.limit) {
    searchParams.set("limit", String(filters.limit));
  }

  if (filters?.sortBy) {
    searchParams.set("sortBy", filters.sortBy);
  }

  if (filters?.sortOrder) {
    searchParams.set("sortOrder", filters.sortOrder);
  }

  const query = searchParams.toString();

  return apiClient<Issue[]>(
    `/api/organizations/${organizationId}/projects/${projectId}/issues${
      query ? `?${query}` : ""
    }`,
    {
      includeMeta: true,
    },
  ) as Promise<IssueListApiResponse>;
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
