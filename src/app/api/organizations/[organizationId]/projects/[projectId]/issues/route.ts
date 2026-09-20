import { getCurrentUser } from "@/features/auth/current-user";
import { createIssue, getIssues } from "@/features/issues/issue.service";
import {
  createIssueSchema,
  issueListQuerySchema,
} from "@/features/issues/issue.validation";
import { AuthorizationError } from "@/server/authorization/authorization-error";
import { permissions } from "@/server/authorization/permissions";
import { requireProjectPermission } from "@/server/authorization/project-access";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      organizationId: string;
      projectId: string;
    }>;
  },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthorizationError("Unauthorized", 401);
    }

    const { organizationId, projectId } = await params;

    await requireProjectPermission(
      user.id,
      organizationId,
      projectId,
      permissions.issue.read,
    );

    const { searchParams } = new URL(request.url);

    const query = {
      status: searchParams.get("status") ?? undefined,
      priority: searchParams.get("priority") ?? undefined,
      assigneeId: searchParams.get("assigneeId") ?? undefined,
      labelId: searchParams.get("labelId") ?? undefined,
    };

    const result = issueListQuerySchema.safeParse(query);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_QUERY",
            message: "Invalid Query Parameters",
          },
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const issues = await getIssues(organizationId, projectId, result.data);

    return NextResponse.json(
      {
        success: true,
        data: issues,
        message: "Issues Fetched Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "GET /api/organizations/[organizationId]/projects/[projectId]/issues failed:",
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
        error: {
          code: "FETCH_FAILED",
          message: "Failed To Fetch Issues",
        },
      },
      { status: 500 },
    );
  }
}

// ############################## POST ##############################

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      organizationId: string;
      projectId: string;
    }>;
  },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthorizationError("Unauthorized", 401);
    }

    const { organizationId, projectId } = await params;

    await requireProjectPermission(
      user.id,
      organizationId,
      projectId,
      permissions.issue.create,
    );

    const body = await request.json();

    const result = await createIssueSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Input Validation Failed",
          },
        },
        { status: 400 },
      );
    }

    const { issue, identifier } = await createIssue(
      organizationId,
      projectId,
      user.id,
      result.data,
    );

    return NextResponse.json(
      {
        success: true,
        data: issue,
        issueIdentifier: identifier,
        message: "Issue Created Successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/organizations/[organizationId]/projects/[projectId]/issues failed:",
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

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid JSON Body" } },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: { message: "Failed To Create Issue" },
      },
      { status: 500 },
    );
  }
}
