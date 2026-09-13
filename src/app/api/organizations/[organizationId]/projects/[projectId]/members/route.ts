import { getCurrentUser } from "@/features/auth/current-user";
import {
  addProjectMember,
  getProjectMembers,
} from "@/features/project-members/services/projectMembers.service";
import { AuthorizationError } from "@/server/authorization/authorization-error";
import { permissions } from "@/server/authorization/permissions";
import { requireOrganizationPermission } from "@/server/authorization/require-permission";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  {
    params,
  }: { params: Promise<{ organizationId: string; projectId: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthorizationError("Unauthorized", 401);
    }

    const { organizationId, projectId } = await params;

    await requireOrganizationPermission(
      user.id,
      organizationId,
      permissions.member.read,
    );

    const members = await getProjectMembers(projectId);

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
      "GET /api/organizations/[organizationId]/projects/[projectId]/members failed:",
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

    if (error instanceof Error) {
      if (error.message === "Project Not Found") {
        return NextResponse.json(
          {
            success: false,
            error: "Project Not Found",
          },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed To Fetch Members",
      },
      { status: 500 },
    );
  }
}

// ########### POST ##########################################
export async function POST(
  request: Request,
  {
    params,
  }: { params: Promise<{ organizationId: string; projectId: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const { organizationId, projectId } = await params;

    await requireOrganizationPermission(
      user.id,
      organizationId,
      permissions.member.invite,
    );

    const body: { userId: string } = await request.json();

    if (body.userId === "" || body.userId.length <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Input Validation Failed",
        },
        { status: 400 },
      );
    }

    const member = await addProjectMember(
      projectId,
      organizationId,
      body.userId,
    );

    return NextResponse.json(
      {
        success: true,
        member,
        message: "Member Added Successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/organizations/[organizationId]/projects/[projectId]/members failed:",
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
                ? "Project Not Found"
                : "Forbidden",
        },
        { status: error.status },
      );
    }

    if (error instanceof Error) {
      if (error.message === "Project Not Found") {
        return NextResponse.json(
          {
            success: false,
            error: "Project Not Found",
          },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed To Fetch Members",
      },
      { status: 500 },
    );
  }
}
