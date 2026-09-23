import { apiClient } from "@/lib/api/client";
import type { Label } from "./label.types";

interface BackendLabel {
  id: string;
  org_id: string;
  name: string;
  color: string | null;
  created_at: string;
  updated_at: string;
}

function mapLabel(label: BackendLabel): Label {
  return {
    id: label.id,
    organizationId: label.org_id,
    name: label.name,
    color: label.color,
    createdAt: label.created_at,
    updatedAt: label.updated_at,
  };
}

export async function getOrganizationLabels(
  organizationId: string,
): Promise<Label[]> {
  const response = await apiClient<BackendLabel[]>(
    `/api/organizations/${organizationId}/labels`,
    {},
  );

  return response.map(mapLabel);
}

export async function getIssueLabels(
  organizationId: string,
  projectId: string,
  issueId: string,
): Promise<string[]> {
  const response = await apiClient<
    Array<{
      id: string;
      issue_id: string;
      label_id: string;
    }>
  >(
    `/api/organizations/${organizationId}/projects/${projectId}/issues/${issueId}/labels`,
  );

  return response.map((item) => item.label_id);
}

export async function attachIssueLabel(
  organizationId: string,
  projectId: string,
  issueId: string,
  labelId: string,
) {
  return apiClient(
    `/api/organizations/${organizationId}/projects/${projectId}/issues/${issueId}/labels`,
    {
      method: "POST",
      body: JSON.stringify({ labelId }),
    },
  );
}

export async function removeIssueLabel(
  organizationId: string,
  projectId: string,
  issueId: string,
  labelId: string,
) {
  return apiClient(
    `/api/organizations/${organizationId}/projects/${projectId}/issues/${issueId}/labels/${labelId}`,
    {
      method: "DELETE",
    },
  );
}
