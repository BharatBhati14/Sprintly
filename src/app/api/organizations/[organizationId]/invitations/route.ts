import { getCurrentUser } from "@/features/auth/current-user";
import { CreateInvitation } from "@/features/invitations/services/createInvitation.service";
import { invitationSchema } from "@/features/invitations/validations/invitation.validation";
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

    const body = await request.json();
    const { organizationId } = await params;

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

    if (
      error instanceof Error &&
      error.message === "Insufficient Permissions"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Only Owner And Admins Are Allowed",
        },
        { status: 403 },
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
