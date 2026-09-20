import { getCurrentUser } from "@/features/auth/current-user";
import { deleteIssueLabel } from "@/features/issue-labels/issueLabels.service";
import { AuthorizationError } from "@/server/authorization/authorization-error";
import { permissions } from "@/server/authorization/permissions";
import { requireProjectPermission } from "@/server/authorization/project-access";
import { NextResponse } from "next/server";

/**
 *
 * @param _request DELETE /api/organizations/[organizationId]/projects/[projectId]/issues/[issueId]/labels/[labelId]
 * @param params organizationId, projectId, issueId, labelId
 * @returns delets a issue-label
 */

export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      organizationId: string;
      projectId: string;
      issueId: string;
      labelId: string;
    }>;
  },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthorizationError("Unauthorized", 401);
    }

    const { organizationId, projectId, issueId, labelId } = await params;

    await requireProjectPermission(
      user.id,
      organizationId,
      projectId,
      permissions.issue.delete,
    );

    const issueLabel = await deleteIssueLabel(
      organizationId,
      projectId,
      issueId,
      labelId,
    );

    return NextResponse.json(
      {
        success: true,
        data: issueLabel,
        message: "issue-label deleted Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "DELETE /api/organizations/[organizationId]/projects/[projectId]/issues/[issueId]/labels/[labelId] failed:",
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
        error: { message: "Failed To delete issue-label" },
      },
      { status: 500 },
    );
  }
}
