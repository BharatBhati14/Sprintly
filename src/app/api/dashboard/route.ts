import { NextResponse } from "next/server";
import { getDashboardData } from "@/features/dashboard/dashboard.service";
import { getCurrentUser } from "@/features/auth/current-user";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required.",
          },
        },
        { status: 401 },
      );
    }

    const data = await getDashboardData(user.id);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to load dashboard.",
        },
      },
      { status: 500 },
    );
  }
}
