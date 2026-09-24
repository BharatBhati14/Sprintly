"use client";

import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import type { DashboardData } from "../dashboard.types";

interface RecentIssuesProps {
  data: DashboardData;
}

export function RecentIssues({ data }: RecentIssuesProps) {
  return (
    <Card className="h-full p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">Recent issues</h2>

          <p className="mt-1 text-xs text-zinc-500">
            Recently created issues across your workspace
          </p>
        </div>
      </div>

      {data.recentIssues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Inbox className="h-5 w-5 text-zinc-400" />

          <p className="mt-3 text-sm font-medium text-zinc-700">
            No issues yet
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Issues will appear here when created.
          </p>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-zinc-100">
          {data.recentIssues.slice(0, 3).map((issue) => (
            <Link
              key={issue.id}
              href={`/organizations/${issue.organizationId}/projects/${issue.projectId}/issues/${issue.id}`}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-xs font-medium text-zinc-400">
                    {issue.projectKey}-{issue.number}
                  </span>

                  <Badge variant="secondary">
                    {formatStatus(issue.status)}
                  </Badge>
                </div>

                <p className="mt-1 truncate text-sm font-medium text-zinc-800">
                  {issue.title}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  {issue.projectName}
                </p>
              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400" />
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
