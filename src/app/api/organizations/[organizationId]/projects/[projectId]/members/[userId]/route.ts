import { getCurrentUser } from "@/features/auth/current-user";
import { removeProjectMember } from "@/features/project-members/services/projectMembers.service";
import { AuthorizationError } from "@/server/authorization/authorization-error";
import { permissions } from "@/server/authorization/permissions";
import { requireOrganizationPermission } from "@/server/authorization/require-permission";
import { NextResponse } from "next/server";

export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      organizationId: string;
      projectId: string;
      userId: string;
    }>;
  },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthorizationError("Unauthorized", 401);
    }

    const { organizationId, projectId, userId } = await params;

    const currentMember = await requireOrganizationPermission(
      user.id,
      organizationId,
      permissions.member.remove,
    );

    const deletedProjectMember = await removeProjectMember(
      currentMember,
      organizationId,
      projectId,
      userId,
    );

    return NextResponse.json(
      {
        success: true,
        data: deletedProjectMember,
        message: "Member Removed Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "DELETE /api/organizations/:organizationId/projects/[projectId]/members/[userId] failed:",
      error,
    );

    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        {
          success: false,
          error:
            error.status === 401
              ? "Unauthorized"
              : error.status === 404
                ? "Organization Not Found"
                : "Forbidden",
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed To Remove Project Member",
      },
      { status: 500 },
    );
  }
}
