"use server";
import { RegisterInput } from "./auth.validation";
import { db } from "@/db";
import { users } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { hash } from "argon2";
import { sessions } from "@/db/schemas/sessions";
import { randomBytes } from "crypto";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

function getSessionExpiry(): Date {
  return new Date(Date.now() + SESSION_DURATION_MS);
}

const ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export async function registerUser(input: RegisterInput) {
  try {
    const [isEmailExists] = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);

    if (isEmailExists) {
      return {
        error: "User already exists with this email",
        status: 400,
      };
    }

    const sessionToken = generateSessionToken();
    const expiresAt = getSessionExpiry();
    const passwordHash = await hash(input.password);

    const result = await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          name: input.name,
          email: input.email,
          password: passwordHash,
        })
        .returning();

      if (!user) {
        return {
          error: "Something went wrong",
          status: 500,
        };
      }

      const [session] = await tx
        .insert(sessions)
        .values({
          id: sessionToken,
          userId: user.id,
          expiresAt: expiresAt,
        })
        .returning();

      if (!session) {
        return {
          error: "Something went wrong",
          status: 500,
        };
      }

      return user;
    });
    return {
      result,
      sessionToken,
      expiresAt,
    };
  } catch (error) {
    return {
      error: "Something went wrong",
      status: 500,
    };
  }
}
