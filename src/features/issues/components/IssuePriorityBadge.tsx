import { Badge } from "@/components/ui";

import type { IssuePriority } from "../issue.types";

interface IssuePriorityBadgeProps {
  priority: IssuePriority;
}

const priorityConfig: Record<
  IssuePriority,
  {
    label: string;
    variant: "secondary" | "default" | "success" | "warning" | "danger";
  }
> = {
  LOW: {
    label: "Low",
    variant: "secondary",
  },
  MEDIUM: {
    label: "Medium",
    variant: "default",
  },
  HIGH: {
    label: "High",
    variant: "warning",
  },
  URGENT: {
    label: "Urgent",
    variant: "danger",
  },
};

export function IssuePriorityBadge({ priority }: IssuePriorityBadgeProps) {
  const config = priorityConfig[priority];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
