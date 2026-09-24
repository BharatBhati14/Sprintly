"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application route error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Something went wrong
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          We couldn't load this page. Try again or return to the dashboard.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => reset()}>Try again</Button>

          <Button
            variant="secondary"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Dashboard
          </Button>
        </div>
      </div>
    </main>
  );
}
