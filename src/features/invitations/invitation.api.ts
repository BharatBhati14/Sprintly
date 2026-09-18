import { apiClient } from "@/lib/api/client";

export interface AcceptInvitationResponse {
  member: {
    id: string;
    organizationId: string;
    userId: string;
    role: string;
  };
}

export async function acceptOrganizationInvitation(
  token: string,
): Promise<AcceptInvitationResponse> {
  return apiClient<AcceptInvitationResponse>(
    `/api/invitations/${token}/accept`,
    {
      method: "POST",
    },
  );
}
