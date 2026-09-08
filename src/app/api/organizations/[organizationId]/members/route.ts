import { getCurrentUser } from "@/features/auth/current-user";
import { getOrganizationMembers } from "@/features/org-members/services/getOrgMembers.service";
import { AuthorizationError } from "@/server/authorization/authorization-error";
import { permissions } from "@/server/authorization/permissions";
import { requireOrganizationPermission } from "@/server/authorization/require-permission";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ organizationId: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthorizationError("Unauthorized", 401);
    }

    const { organizationId } = await params;

    // const isOrgMember = await requireOrganizationMember(
    //   user.id,
    //   organizationId,
    // );

    await requireOrganizationPermission(
      user.id,
      organizationId,
      permissions.member.read,
    );

    const members = await getOrganizationMembers(organizationId);

    return NextResponse.json(
      {
        success: true,
        members,
        message: "Members Fetched Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "GET /api/organizations/:organizationId/members failed:",
      error,
    );

    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        {
          success: false,
          error: error.status === 404 ? "Organization Not Found" : "Forbidden",
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
