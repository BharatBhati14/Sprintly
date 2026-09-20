import { getCurrentUser } from "@/features/auth/current-user";
import {
  deleteIssue,
  getIssue,
  updateIssue,
} from "@/features/issues/issue.service";
import { updateIssueSchema } from "@/features/issues/issue.validation";
import { AuthorizationError } from "@/server/authorization/authorization-error";
import { permissions } from "@/server/authorization/permissions";
import { requireProjectPermission } from "@/server/authorization/project-access";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      organizationId: string;
      projectId: string;
      issueId: string;
    }>;
  },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthorizationError("Unauthorized", 401);
    }

    const { organizationId, projectId, issueId } = await params;

    await requireProjectPermission(
      user.id,
      organizationId,
      projectId,
      permissions.issue.read,
    );

    const issue = await getIssue(projectId, issueId);

    if (!issue) {
      throw new AuthorizationError("Issue Not Found", 404);
    }

    return NextResponse.json(
      {
        success: true,
        data: issue,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "GET /api/organizations/[organizationId]/projects/[projectId]/issues/[issueId] failed:",
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
                ? "Not Found"
                : "Forbidden",
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: { message: "Failed To Fetch Issue" },
      },
      { status: 500 },
    );
  }
}

// ##################### PATCH #################

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      organizationId: string;
      projectId: string;
      issueId: string;
    }>;
  },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthorizationError("Unauthorized", 401);
    }

    const { organizationId, projectId, issueId } = await params;

    await requireProjectPermission(
      user.id,
      organizationId,
      projectId,
      permissions.issue.update,
    );

    const body = await request.json();

    const result = updateIssueSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Input Validation Failed" },
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const issue = await updateIssue(projectId, issueId, result.data);

    return NextResponse.json(
      {
        success: true,
        data: issue,
        message: "Issue Updated Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "PATCH /api/organizations/[organizationId]/projects/[projectId]/issues/[issueId] failed:",
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
                ? "Not Found"
                : "Forbidden",
        },
        { status: error.status },
      );
    }

    if (error instanceof Error) {
      if (error.message === "No fields to update") {
        return NextResponse.json(
          {
            success: false,
            error: { message: "No fields to update" },
          },
          { status: 400 },
        );
      }
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Invalid JSON Body" },
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: { message: "Failed To Update Issue" },
      },
      { status: 500 },
    );
  }
}

// ############### delete #########################

export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      organizationId: string;
      projectId: string;
      issueId: string;
    }>;
  },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthorizationError("Unauthorized", 401);
    }

    const { organizationId, projectId, issueId } = await params;

    await requireProjectPermission(
      user.id,
      organizationId,
      projectId,
      permissions.issue.delete,
    );

    const issue = await deleteIssue(projectId, issueId);

    return NextResponse.json(
      {
        success: true,
        data: issue,
        message: "Issue Deleted Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "DELETE /api/organizations/[organizationId]/projects/[projectId]/issues/[issueId] failed:",
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
                ? "Not Found"
                : "Forbidden",
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: { message: "Failed To Delete Issue" },
      },
      { status: 500 },
    );
  }
}
