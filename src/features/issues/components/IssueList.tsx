import { IssueCard } from "./IssueCard";

import type { Issue } from "../issue.types";

interface IssueListProps {
  issues: Issue[];
  organizationId: string;
  projectId: string;
  isProjectDPage?: boolean;
}

export function IssueList({
  issues,
  organizationId,
  projectId,
  isProjectDPage,
}: IssueListProps) {
  return (
    <div className="space-y-3">
      {issues.map((issue, index) => {
        if (isProjectDPage && index >= 5) {
          return;
        }
        return (
          <IssueCard
            key={issue.id}
            issue={issue}
            organizationId={organizationId}
            projectId={projectId}
          />
        );
      })}
    </div>
  );
}
