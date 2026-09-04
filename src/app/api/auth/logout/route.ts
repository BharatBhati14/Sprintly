import { db } from "@/db";
import { sessions } from "@/db/schemas";
import {
  clearSessionCookie,
  getSessionToken,
} from "@/features/auth/auth.cookies";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const sessionToken = await getSessionToken();

    if (!sessionToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionToken))
      .limit(1);

    if (!session || session.expiresAt.getTime() <= Date.now()) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    await db.delete(sessions).where(eq(sessions.id, sessionToken));

    await clearSessionCookie();

    return NextResponse.json(
      {
        success: true,
        message: "User Logout Successful",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("POST /api/auth/logout failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: `Internal Server Error`,
      },
      { status: 500 },
    );
  }
}
