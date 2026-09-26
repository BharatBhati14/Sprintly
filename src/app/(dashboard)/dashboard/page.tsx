"use client";

import { RefreshCw } from "lucide-react";

import { AppShell } from "@/components/layout";
import { Button, Card, Skeleton, useToast } from "@/components/ui";

import {
  DashboardStats,
  IssueStatusOverview,
  RecentIssues,
  RecentProjects,
} from "@/features/dashboard/components";

import { useDashboard } from "@/features/dashboard";

import { useAuth } from "@/features/auth/auth.hooks";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { data, loading, error, reload } = useDashboard();
  const { toast } = useToast();

  const handleStatNavigation = (
    type: "projects" | "openIssues" | "assigned" | "dueSoon",
  ) => {
    switch (type) {
      case "projects":
        router.push("/organizations");
        break;

      case "openIssues":
        router.push("/organizations");
        break;

      case "assigned":
        router.push("/organizations");
        break;

      case "dueSoon":
        router.push("/organizations");
        break;
    }
  };

  return (
    <AppShell>
      <div className="space-y-8 p-4 md:p-6">
        {/* <Button
          onClick={() =>
            toast({
              type: "success",
              title: "Test successful",
              message: "Toast notifications are working.",
            })
          }
        >
          Test toast
        </Button> */}
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-zinc-600">
              Welcome back
              {user?.name ? `, ${user.name}` : ""}. Here's what's happening
              across your workspace.
            </p>
          </div>

          <Button variant="secondary" onClick={reload} disabled={loading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Loading */}
        {loading && <DashboardSkeleton />}

        {/* Error */}
        {!loading && error && (
          <Card>
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <h2 className="text-sm font-semibold text-zinc-900">
                Unable to load dashboard
              </h2>

              <p className="mt-1 max-w-md text-sm text-zinc-500">{error}</p>

              <Button className="mt-5" onClick={reload}>
                Try again
              </Button>
            </div>
          </Card>
        )}

        {/* Content */}
        {!loading && !error && data && (
          <>
            <DashboardStats
              totals={data.totals}
              onNavigate={handleStatNavigation}
            />

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <IssueStatusOverview data={data} />

              <RecentIssues data={data} />
            </div>

            <RecentProjects data={data} />
          </>
        )}
      </div>
    </AppShell>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>

      <Skeleton className="h-72 rounded-xl" />
    </div>
  );
}
