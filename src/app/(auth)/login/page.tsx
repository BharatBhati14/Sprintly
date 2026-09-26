import { LoginForm } from "@/features/auth/components/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-7 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-950">
          Welcome back
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Sign in to continue to Sprintly.
        </p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
