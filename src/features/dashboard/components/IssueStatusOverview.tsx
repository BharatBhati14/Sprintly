"use client";

import { Card } from "@/components/ui";

import type { DashboardData } from "../dashboard.types";

interface IssueStatusOverviewProps {
  data: DashboardData;
}

const statuses = [
  {
    key: "BACKLOG" as const,
    label: "Backlog",
  },
  {
    key: "TODO" as const,
    label: "To do",
  },
  {
    key: "IN_PROGRESS" as const,
    label: "In progress",
  },
  {
    key: "IN_REVIEW" as const,
    label: "In review",
  },
  {
    key: "DONE" as const,
    label: "Done",
  },
];

export function IssueStatusOverview({ data }: IssueStatusOverviewProps) {
  const total = Object.values(data.issueStatusCounts).reduce(
    (sum, value) => sum + value,
    0,
  );

  return (
    <Card>
      <div className="p-6">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-zinc-900">
            Issue overview
          </h2>

          <p className="mt-1 text-xs text-zinc-500">
            Issues grouped by their current status
          </p>
        </div>

        <div className="space-y-4">
          {statuses.map((status) => {
            const count = data.issueStatusCounts[status.key];

            const percentage =
              total > 0 ? Math.round((count / total) * 100) : 0;

            return (
              <div key={status.key}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-700">
                    {status.label}
                  </span>

                  <span className="text-zinc-500">{count}</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-zinc-900 transition-all"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
