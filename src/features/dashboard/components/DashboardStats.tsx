"use client";

import { Card } from "@/components/ui";
import { FolderKanban, CircleDot, UserCheck, Clock3 } from "lucide-react";

interface DashboardStatsProps {
  totals: {
    projects: number;
    openIssues: number;
    assignedToMe: number;
    dueSoon: number;
  };
  onNavigate: (
    type: "projects" | "openIssues" | "assigned" | "dueSoon",
  ) => void;
}

export function DashboardStats({ totals, onNavigate }: DashboardStatsProps) {
  const stats = [
    {
      label: "Projects",
      value: totals.projects,
      icon: FolderKanban,
      type: "projects" as const,
    },
    {
      label: "Open Issues",
      value: totals.openIssues,
      icon: CircleDot,
      type: "openIssues" as const,
    },
    {
      label: "Assigned to Me",
      value: totals.assignedToMe,
      icon: UserCheck,
      type: "assigned" as const,
    },
    {
      label: "Due Soon",
      value: totals.dueSoon,
      icon: Clock3,
      type: "dueSoon" as const,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <button
            key={stat.label}
            type="button"
            onClick={() => onNavigate(stat.type)}
            className="text-left"
          >
            <Card className="transition-colors hover:border-zinc-300 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-zinc-900">
                    {stat.value}
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-200 p-2">
                  <Icon className="h-5 w-5 text-zinc-600" />
                </div>
              </div>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
