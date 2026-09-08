import { getCurrentUser } from "@/features/auth/current-user";
import { CreateInvitation } from "@/features/invitations/services/createInvitation.service";
import { invitationSchema } from "@/features/invitations/validations/invitation.validation";
import { AuthorizationError } from "@/server/authorization/authorization-error";
import { permissions } from "@/server/authorization/permissions";
import { requireOrganizationPermission } from "@/server/authorization/require-permission";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const { organizationId } = await params;

    await requireOrganizationPermission(
      user.id,
      organizationId,
      permissions.member.invite,
    );

    const body = await request.json();
    const result = invitationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Input",
          errors: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { email } = result.data;

    const invitation = await CreateInvitation({
      userId: user.id,
      organizationId,
      email,
    });

    if (!invitation) {
      return NextResponse.json(
        {
          success: false,
          error: "Invitation Creation Failed",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Invitation Created Successfully",
        invitation,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/organizations/:organizationId/invitations failed:",
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

    if (
      error instanceof Error &&
      error.message === "User Is Already A Member"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "User Is Already A Member",
        },
        { status: 409 },
      );
    }

    if (
      error instanceof Error &&
      error.message === "Invitation is Already Pending"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "User Was Already Sent An Invitation",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Something Went Wrong",
      },
      { status: 500 },
    );
  }
}
