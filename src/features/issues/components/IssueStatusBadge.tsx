import { Badge } from "@/components/ui";

import type { IssueStatus } from "../issue.types";

interface IssueStatusBadgeProps {
  status: IssueStatus;
}

const statusConfig: Record<
  IssueStatus,
  {
    label: string;
    variant: "secondary" | "default" | "success" | "warning" | "danger";
  }
> = {
  BACKLOG: {
    label: "Backlog",
    variant: "secondary",
  },
  TODO: {
    label: "Todo",
    variant: "default",
  },
  IN_PROGRESS: {
    label: "In Progress",
    variant: "warning",
  },
  IN_REVIEW: {
    label: "In Review",
    variant: "default",
  },
  DONE: {
    label: "Done",
    variant: "success",
  },
};

export function IssueStatusBadge({ status }: IssueStatusBadgeProps) {
  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
