import { db } from "@/db";
import { organizations } from "@/db/schemas";
import { getCurrentUser } from "@/features/auth/current-user";
import { deleteOrganization } from "@/features/organizations/services/deleteOrganization.service";
import { updateOrganization } from "@/features/organizations/services/updateOrganization.service";
import { updateOrganizationSchema } from "@/features/organizations/validations/organization.validation";
import { requireOrganizationMember } from "@/server/authorization/organization-access";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ organizationId: string }>;
  },
) {
  try {
    const { organizationId } = await params;
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

    try {
      await requireOrganizationMember(user.id, organizationId);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Organization Not Found",
        },
        { status: 404 },
      );
    }

    const [organization] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, organizationId))
      .limit(1);

    if (!organization) {
      return NextResponse.json(
        {
          success: false,
          error: "Organization Not Found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        organization,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/organizations/:organizationId failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed To Fetch Organization",
      },
      { status: 500 },
    );
  }
}

/**
 *
 * @param request PATCH   /api/organizations/:organizationId
 * @param param1 organizationId
 * @returns updates an organization
 */

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> },
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

    const { organizationId } = await params;

    try {
      const validMember = await requireOrganizationMember(
        user.id,
        organizationId,
      );

      if (validMember.role !== "OWNER") {
        return NextResponse.json(
          {
            success: false,
            error: "Forbidden",
          },
          { status: 403 },
        );
      }
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Organization Not Found",
        },
        { status: 404 },
      );
    }

    const body = await request.json();

    const result = await updateOrganizationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation Failed",
        },
        { status: 400 },
      );
    }

    const updatedOrganization = await updateOrganization(
      organizationId,
      result.data,
    );

    if (!updatedOrganization) {
      return NextResponse.json(
        {
          success: false,
          error: "Organization Not Found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        updatedOrganization,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH /api/organizations/:organizationId failed:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug Already Exists",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed To Update Organization",
      },
      { status: 500 },
    );
  }
}

/**
 *
 * @param request DELETE   /api/organizations/:organizationId
 * @param param1 organizationId
 * @returns deletes an organization
 */

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> },
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

    const { organizationId } = await params;

    try {
      const validMember = await requireOrganizationMember(
        user.id,
        organizationId,
      );

      if (validMember.role !== "OWNER") {
        return NextResponse.json(
          {
            success: false,
            error: "Forbidden",
          },
          { status: 403 },
        );
      }
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Organization Not Found",
        },
        { status: 404 },
      );
    }

    const deletedOrganization = await deleteOrganization(organizationId);

    if (!deletedOrganization) {
      return NextResponse.json(
        {
          success: false,
          error: "Organization Not Found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        deletedOrganization,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/organizations/:organizationId failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed To Delete Organization",
      },
      { status: 500 },
    );
  }
}
