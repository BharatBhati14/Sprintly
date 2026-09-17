import { apiClient } from "@/lib/api/client";
import type { LoginInput, RegisterInput, User } from "./auth.types";

export async function login(input: LoginInput): Promise<User> {
  return apiClient<User>("/api/auth/sign-in", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function register(input: RegisterInput): Promise<User> {
  return apiClient<User>("/api/auth/sign-up", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getCurrentUser(): Promise<User> {
  return apiClient<User>("/api/auth/me", {
    method: "GET",
  });
}

export async function logout(): Promise<void> {
  await apiClient<void>("/api/auth/logout", {
    method: "POST",
  });
}
