import { getCurrentUser } from "@/features/auth/current-user";
import {
  deleteLabel,
  getLabel,
  updateLabel,
} from "@/features/labels/label.service";
import { updateLabelSchema } from "@/features/labels/label.validation";
import { AuthorizationError } from "@/server/authorization/authorization-error";
import { permissions } from "@/server/authorization/permissions";
import { requireOrganizationPermission } from "@/server/authorization/require-permission";
import { NextResponse } from "next/server";

/**
 * @param _request /api/organizations/[organizationId]/labels/[labelId]
 * @param params organizationId , labelId
 * @returns fetch individual label
 */

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ organizationId: string; labelId: string }>;
  },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthorizationError("Unauthorized", 401);
    }

    const { organizationId, labelId } = await params;

    await requireOrganizationPermission(
      user.id,
      organizationId,
      permissions.label.read,
    );

    const label = await getLabel(labelId, organizationId);

    return NextResponse.json(
      {
        success: true,
        label,
        message: "Label Fetched Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "GET /api/organizations/[organizationId]/labels/[labelId] failed:",
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
        error: "Failed To Fetch Label",
      },
      { status: 500 },
    );
  }
}

/**
 * @param request /api/organizations/[organizationId]/labels/[labelId]
 * @param params organizationId , labelId
 * @returns updated label
 */

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      organizationId: string;
      labelId: string;
    }>;
  },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthorizationError("Unauthorized", 401);
    }

    const { organizationId, labelId } = await params;

    await requireOrganizationPermission(
      user.id,
      organizationId,
      permissions.label.update,
    );

    const body = await request.json();

    const result = updateLabelSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Input Validation Failed",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const label = await updateLabel(labelId, organizationId, result.data);

    return NextResponse.json(
      {
        success: true,
        label,
        message: "Label Updated Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "PATCH /api/organizations/[organizationId]/labels/[labelId] failed:",
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
        error: "Failed To Fetch Label",
      },
      { status: 500 },
    );
  }
}

/**
 * @param _request /api/organizations/[organizationId]/labels/[labelId]
 * @param params organizationId , labelId
 * @returns deletes a label
 */

export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      organizationId: string;
      labelId: string;
    }>;
  },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthorizationError("Unauthorized", 401);
    }

    const { organizationId, labelId } = await params;

    await requireOrganizationPermission(
      user.id,
      organizationId,
      permissions.label.update,
    );

    const label = await deleteLabel(labelId, organizationId);

    return NextResponse.json(
      {
        success: true,
        label,
        message: "Label deleted Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "DELETE /api/organizations/[organizationId]/labels/[labelId] failed:",
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
        error: "Failed To delete Label",
      },
      { status: 500 },
    );
  }
}
