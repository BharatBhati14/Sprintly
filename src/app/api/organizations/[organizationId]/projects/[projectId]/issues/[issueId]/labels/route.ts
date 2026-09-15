import { getCurrentUser } from "@/features/auth/current-user";
import {
  attachLabelToIssues,
  getIssuesLabels,
} from "@/features/issue-labels/issueLabels.service";
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

    const issueLabels = await getIssuesLabels(issueId);

    if (!issueLabels) {
      throw new AuthorizationError("Issue-labels Not Found", 404);
    }

    return NextResponse.json(
      {
        success: true,
        issueLabels,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "GET /api/organizations/[organizationId]/projects/[projectId]/issues/[issueId]/labels failed:",
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
        error: "Failed To Fetch Issue-labels",
      },
      { status: 500 },
    );
  }
}

/**
 * @param request POST /api/organizations/[organizationId]/projects/[projectId]/issues/[issueId]/labels
 * @param params organizationId , projectId , issueId
 * @returns creates a issue-label
 */

export async function POST(
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
      permissions.issue.assign,
    );

    const body: { labelId: string } = await request.json();

    if (!body.labelId) {
      return NextResponse.json(
        {
          success: false,
          error: "LabelId is required",
        },
        { status: 400 },
      );
    }

    const issueLabel = await attachLabelToIssues(
      organizationId,
      projectId,
      issueId,
      body.labelId,
    );

    return NextResponse.json(
      {
        success: true,
        issueLabel,
        message: "issue-label Created Successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/organizations/[organizationId]/projects/[projectId]/issues/[issueId]/labels failed:",
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
      if (error.message === "Issue-label already exists") {
        return NextResponse.json(
          {
            success: false,
            error: "Issue-label already exists",
          },
          { status: 400 },
        );
      }
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON Body",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed To create issue-label",
      },
      { status: 500 },
    );
  }
}
