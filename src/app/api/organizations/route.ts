import { getCurrentUser } from "@/features/auth/current-user";
import { createOrganization } from "@/features/organizations/services/createOrganization.service";
import { organizationSchema } from "@/features/organizations/validations/organization.validation";
import { NextRequest, NextResponse } from "next/server";

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
      user,
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
