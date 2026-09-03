import { setSessionCookie } from "@/features/auth/auth.cookies";
import { registerUser } from "@/features/auth/auth.service";
import { RegisterInput, registerSchema } from "@/features/auth/auth.validation";
import { env } from "@/lib/env";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
          issues: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const registration = await registerUser(result.data);

    if (registration.error || registration.status) {
      return NextResponse.json(
        {
          message: registration.error,
        },
        { status: registration.status },
      );
    }

    if (!registration.sessionToken || !registration.expiresAt) {
      return NextResponse.json(
        {
          message: "Invalid or empty session key or has been expired",
        },
        { status: 401 },
      );
    }

    await setSessionCookie(registration.sessionToken, registration.expiresAt);

    return NextResponse.json(
      {
        user: registration.result,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "User Registeration Unsuccessful",
      },
      { status: 400 },
    );
  }
}
