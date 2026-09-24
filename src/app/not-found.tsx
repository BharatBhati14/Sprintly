import Link from "next/link";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-md text-center">
        <p className="text-sm font-medium text-zinc-500">404</p>

        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
          Page not found
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
