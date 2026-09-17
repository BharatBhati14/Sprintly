"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ApiError } from "@/lib/api/errors";
import { Button, Input } from "@/components/ui";
import { useAuth } from "../auth.hooks";
import { register } from "../auth.api";

export function RegisterForm() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

    if (trimmedName.length < 3) {
      setError("Name must be atleast 3 characters long.");
      return;
    }

    if (!trimmedEmail) {
      setError("Email is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name: trimmedName,
        email: trimmedEmail,
        password,
        confirmPassword,
      });

      /*
       * Registration and login are intentionally treated
       * separately. Refreshing the current user allows this
       * to work whether the backend automatically creates
       * a session during registration or not.
       */
      await refreshUser();

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Unable to create your account. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-4">
        <Input
          id="name"
          name="name"
          type="text"
          label="Name"
          placeholder="Your name"
          autoComplete="name"
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setName(event.target.value)
          }
          disabled={isSubmitting}
        />

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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(event.target.value)
          }
          disabled={isSubmitting}
        />

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm password"
          placeholder="Enter your password again"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setConfirmPassword(event.target.value)
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
        Create account
      </Button>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-600"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
