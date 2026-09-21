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

            <p className="text-sm text-zinc-500">{issue?.desc}</p>
          </div>

          <div>
            <span className="text-gray-600 text-xs">Priority&nbsp;</span>
            <IssuePriorityBadge priority={issue.priority} />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <span className="text-gray-600 text-xs">Status&nbsp;</span>
            <IssueStatusBadge status={issue.status} />
          </div>

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
