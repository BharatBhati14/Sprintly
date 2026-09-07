import { getOrganizationMembers } from "@/features/org-members/services/getOrgMembers.service";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ organizationId: string }> },
) {
  try {
    const { organizationId } = await params;

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

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          {
            success: false,
            error: "Unauthorized",
          },
          { status: 401 },
        );
      }

      if (
        error.message === "User is not member of Organization" ||
        error.message === "Organization membership not found"
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "User is not member of Organization",
          },
          { status: 404 },
        );
      }
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
