import { db } from "@/db";
import { organizations } from "@/db/schemas";
import { getCurrentUser } from "@/features/auth/current-user";
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
