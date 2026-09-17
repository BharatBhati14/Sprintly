"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AppShell, PageHeader } from "@/components/layout";
import { Skeleton } from "@/components/ui";
import { useAuth } from "@/features/auth/auth.hooks";

export default function DashboardPage() {
  const router = useRouter();

  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <AppShell>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="mt-3 h-5 w-72" />
        </div>
      </AppShell>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Dashboard"
          description={`Welcome back, ${user.name}.`}
        />

        <div className="mt-6 rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
          <h2 className="text-sm font-medium text-zinc-950">
            Your workspace is ready
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Create an organization to get started.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
