import { db } from "@/db";
import { getSessionToken } from "./auth.cookies";
import { sessions, User, users } from "@/db/schemas";
import { eq } from "drizzle-orm";

export async function getCurrentUser(): Promise<Omit<User, "password"> | null> {
  try {
    const sessionToken = await getSessionToken();

    if (!sessionToken) {
      return null;
    }

    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionToken))
      .limit(1);

    if (!session || session.expiresAt.getTime() <= Date.now()) {
      return null;
    }

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    throw new Error("Something Went Wrong");
  }
}
