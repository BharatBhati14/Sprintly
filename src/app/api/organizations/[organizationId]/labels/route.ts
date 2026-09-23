import { getCurrentUser } from "@/features/auth/current-user";
import { createLabel, getLabels } from "@/features/labels/label.service";
import { labelSchema } from "@/features/labels/label.validation";
import { AuthorizationError } from "@/server/authorization/authorization-error";
import { permissions } from "@/server/authorization/permissions";
import { requireOrganizationPermission } from "@/server/authorization/require-permission";
import { NextResponse } from "next/server";

/**
 *
 * @param _request /api/organizations/:organizationId/labels
 * @param param1 organizationId
 * @returns list of labels
 */

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ organizationId: string }>;
  },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthorizationError("Unauthorized", 401);
    }

    const { organizationId } = await params;

    await requireOrganizationPermission(
      user.id,
      organizationId,
      permissions.label.read,
    );

    const labels = await getLabels(organizationId);

    return NextResponse.json(
      {
        success: true,
        data: labels,
        message: "Labels Fetched Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "GET /api/organizations/[organizationId]/labels failed:",
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
        error: "Failed To Fetch Labels",
      },
      { status: 500 },
    );
  }
}

/**
 *
 * @param request /api/organizations/:organizationId/labels
 * @param param1 organizationId
 * @returns label
 */
export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ organizationId: string }>;
  },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthorizationError("Unauthorized", 401);
    }

    const { organizationId } = await params;

    await requireOrganizationPermission(
      user.id,
      organizationId,
      permissions.label.create,
    );

    const body = await request.json();

    const result = labelSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Input Validation Failed",
        },
        { status: 400 },
      );
    }

    const label = await createLabel(organizationId, result.data);

    return NextResponse.json(
      {
        success: true,
        data: label,
        message: "Label Created Successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/organizations/[organizationId]/labels failed:",
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
      if (error.message === "Label with this name already exists") {
        return NextResponse.json(
          { success: false, error: "Label with this name already exists" },
          { status: 400 },
        );
      }

      if (error.message === "Invalid Color input") {
        return NextResponse.json(
          { success: false, error: "Invalid Color input" },
          { status: 400 },
        );
      }
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON Body" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed To Create Label",
      },
      { status: 500 },
    );
  }
}
