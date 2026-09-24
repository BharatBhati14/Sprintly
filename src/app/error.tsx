"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Something went wrong
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          An unexpected error occurred. Please try again.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => reset()}>Try again</Button>

          <Button
            variant="secondary"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Go to dashboard
          </Button>
        </div>
      </div>
    </main>
  );
}
