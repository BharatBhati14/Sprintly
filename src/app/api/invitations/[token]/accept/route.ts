import { acceptInvitation } from "@/features/invitations/services/acceptInvitation.service";
import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INVITATION_TOKEN",
            message: "Invitation token is required.",
          },
        },
        { status: 400 },
      );
    }

    const memberCreated = await acceptInvitation(token);

    return NextResponse.json(
      {
        success: true,
        data: {
          member: memberCreated,
        },
        message: "Invitation accepted",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("POST /api/invitations/:token/accept failed:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "You must be logged in to accept this invitation.",
          },
        },
        { status: 401 },
      );
    }

    if (
      error instanceof Error &&
      error.message === "User is already a member of this organization"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ALREADY_MEMBER",
            message: "You are already a member of this organization.",
          },
        },
        { status: 409 },
      );
    }

    if (
      error instanceof Error &&
      error.message === "Invitation Does Not Exists Or Has Expired"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVITATION_INVALID_OR_EXPIRED",
            message: "This invitation does not exist or has expired.",
          },
        },
        { status: 400 },
      );
    }

    if (
      error instanceof Error &&
      error.message === "Invitation email does not match authenticated user"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVITATION_EMAIL_MISMATCH",
            message: "This invitation was sent to a different email address.",
          },
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong.",
        },
      },
      { status: 500 },
    );
  }
}
