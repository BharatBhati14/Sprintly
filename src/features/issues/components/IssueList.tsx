import { IssueCard } from "./IssueCard";

import type { Issue } from "../issue.types";

interface IssueListProps {
  issues: Issue[];
  organizationId: string;
  projectId: string;
}

export function IssueList({
  issues,
  organizationId,
  projectId,
}: IssueListProps) {
  return (
    <div className="space-y-3">
      {issues.map((issue) => (
        <IssueCard
          key={issue.id}
          issue={issue}
          organizationId={organizationId}
          projectId={projectId}
        />
      ))}
    </div>
  );
}
