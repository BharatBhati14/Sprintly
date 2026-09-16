import { getCurrentUser } from "@/features/auth/current-user";
import { createOrganization } from "@/features/organizations/services/createOrganization.service";
import { getListOrganization } from "@/features/organizations/services/getListOfOrganizations.service";
import { organizationSchema } from "@/features/organizations/validations/organization.validation";
import { paginationQuerySchema } from "@/lib/pagination/pagination";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET  /api/organizations
 * @returns List of Organizations
 */

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);

    const query = paginationQuerySchema.safeParse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });
    if (!query.success) {
      return NextResponse.json(
        { success: false, error: "Invalid pagination parameters" },
        { status: 400 },
      );
    }

    const result = await getListOrganization(user.id, query.data);

    return NextResponse.json(
      {
        success: true,
        organizations: result.data,
        pagination: result.pagination,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/organizations failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch organizations",
      },
      { status: 500 },
    );
  }
}

/**
 * POST   /api/organizations
 * @param request name
 * @returns Creates an Organization and Member as OWNER
 */

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    const result = await organizationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation Failed",
        },
        { status: 400 },
      );
    }

    const { organization, orgMember } = await createOrganization(
      user.id,
      result.data,
    );

    if (!organization || !orgMember) {
      return NextResponse.json(
        {
          success: false,
          error: "Organization Creation Failed",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Organization Created Successfully",
        organization,
        orgMember,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/organizations failed:", error);

    if (
      error instanceof Error &&
      (error.message === "Slug Creation Failed" ||
        error.message === "Organization Creation Failed")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Organization Creation Failed",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Organization Creation Failed",
      },
      { status: 400 },
    );
  }
}
