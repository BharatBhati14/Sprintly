import Link from "next/link";

import { Card } from "@/components/ui";

import { IssuePriorityBadge } from "./IssuePriorityBadge";
import { IssueStatusBadge } from "./IssueStatusBadge";

import type { Issue } from "../issue.types";

interface IssueCardProps {
  issue: Issue;
  organizationId: string;
  projectId: string;
}

export function IssueCard({
  issue,
  organizationId,
  projectId,
}: IssueCardProps) {
  return (
    <Link
      href={`/organizations/${organizationId}/projects/${projectId}/issues/${issue.id}`}
      className="block"
    >
      <Card className="p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50/50">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-400">#{issue.number}</p>

            <h3 className="mt-1 truncate font-medium text-zinc-950">
              {issue.title}
            </h3>
          </div>

          <IssuePriorityBadge priority={issue.priority} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <IssueStatusBadge status={issue.status} />

          {issue.dueDate && (
            <span className="text-xs text-zinc-500">
              Due {new Date(issue.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}
