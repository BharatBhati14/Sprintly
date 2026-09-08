import { getCurrentUser } from "@/features/auth/current-user";
import { removeOrganizationMember } from "@/features/org-members/services/removeOrganizationMember.service";
import { updateMemberRole } from "@/features/org-members/services/updateMemberRole.service";
import { updateMemberRoleSchema } from "@/features/org-members/validations/member.validation";
import { AuthorizationError } from "@/server/authorization/authorization-error";
import { permissions } from "@/server/authorization/permissions";
import { requireOrganizationPermission } from "@/server/authorization/require-permission";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      organizationId: string;
      userId: string;
    }>;
  },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthorizationError("Unauthorized", 401);
    }

    const { organizationId, userId } = await params;

    const currentMember = await requireOrganizationPermission(
      user.id,
      organizationId,
      permissions.member.changeRole,
    );

    const body = await request.json();

    const result = updateMemberRoleSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation Failed",
        },
        { status: 400 },
      );
    }

    const updatedMember = await updateMemberRole(
      currentMember,
      organizationId,
      userId,
      result.data.role,
    );

    return NextResponse.json(
      {
        success: true,
        member: updatedMember,
        message: "Member Role Updated Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "PATCH /api/organizations/:organizationId/members/:userId failed:",
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
        error: "Failed To Update Member Role",
      },
      { status: 500 },
    );
  }
}

// ################### DELETE #################

export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      organizationId: string;
      userId: string;
    }>;
  },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthorizationError("Unauthorized", 401);
    }

    const { organizationId, userId } = await params;

    const currentMember = await requireOrganizationPermission(
      user.id,
      organizationId,
      permissions.member.remove,
    );

    const deletedMember = await removeOrganizationMember(
      currentMember,
      organizationId,
      userId,
    );

    return NextResponse.json(
      {
        success: true,
        member: deletedMember,
        message: "Member Removed Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "DELETE /api/organizations/:organizationId/members/:userId failed:",
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
        error: "Failed To Remove Organization Member",
      },
      { status: 500 },
    );
  }
}
