import { setSessionCookie } from "@/features/auth/auth.cookies";
import { loginUser } from "@/features/auth/auth.service";
import { loginSchema } from "@/features/auth/auth.validation";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "VALIDATION ERROR",
          issues: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const login = await loginUser(result.data);

    await setSessionCookie(login.sessionToken, login.expiresAt);

    return NextResponse.json(
      {
        success: true,
        user: login.user,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid Credentials") {
      return NextResponse.json(
        {
          error: "INVALID CREDENTIALS",
          message: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    console.error("Login error:", error);

    return NextResponse.json(
      {
        error: "INTERNAL SERVER ERROR",
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
