"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { ApiError } from "@/lib/api/errors";
import { Button, Input } from "@/components/ui";
import { useAuth } from "../auth.hooks";

export function LoginForm() {
  const searchParams = useSearchParams();
  // const redirectTo = searchParams.get("redirect") || "/";
  const redirectParam = searchParams.get("redirect");
  const redirectTo =
    redirectParam && redirectParam.startsWith("/") ? redirectParam : "/";

  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter valid email address.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    // if (password.length < 8) {
    //   setError("Password must be atleast 8 characters.");
    //   return;
    // }

    setIsSubmitting(true);

    try {
      await login({
        email: email.trim(),
        password,
      });

      router.replace("/dashboard");
      router.replace(redirectTo);
      //   router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401 || error.status === 404) {
          setError("Invalid email or password");
        } else {
          setError(error.message);
        }
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(event.target.value)
          }
          disabled={isSubmitting}
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(event.target.value)
          }
          disabled={isSubmitting}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        Sign in
      </Button>

      <p className="text-center text-sm text-zinc-500">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-600"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
