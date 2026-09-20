export type IssueStatus =
  | "BACKLOG"
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "DONE";

export type IssuePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Issue {
  id: string;
  projectId: string;
  number: number;

  title: string;
  description: string | null;

  status: IssueStatus;
  priority: IssuePriority;

  assigneeId: string | null;
  reporterId: string;

  dueDate: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateIssueInput {
  title: string;
  description?: string;
  priority?: IssuePriority;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export interface UpdateIssueInput {
  title?: string;
  description?: string;
  priority?: IssuePriority;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export interface UpdateIssueStatusInput {
  status: IssueStatus;
}

export interface IssueFilters {
  status?: IssueStatus;
  priority?: IssuePriority;
  assigneeId?: string;
  page?: number;
  limit?: number;
}

export interface IssuePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
