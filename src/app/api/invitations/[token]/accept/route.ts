import { acceptInvitation } from "@/features/invitations/services/acceptInvitation.service";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;

    if (!token) {
    }
    // .catch(() => {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Invalid or empty token",
    //     },
    //     { status: 400 },
    //   );
    // });

    const memberCreated = await acceptInvitation(token);

    return NextResponse.json(
      {
        success: true,
        member: memberCreated,
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
          error: "Unauthorized",
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
          error: "User is already a member of this organization",
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
          error: "Invitation Does Not Exists Or Has Expired",
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
          error: "Invitation email does not match.",
        },
        { status: 403 },
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
