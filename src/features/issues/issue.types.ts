export type IssueStatus =
  | "BACKLOG"
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "DONE";

export type IssuePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type IssueSortField = "createdAt" | "updatedAt" | "dueDate" | "priority";

export type SortOrder = "asc" | "desc";

export interface IssueLabel {
  id: string;
  name: string;
  color: string | null;
}

export interface Issue {
  id: string;
  projectId: string;
  number: number;

  title: string;
  desc: string | null;

  status: IssueStatus;
  priority: IssuePriority;

  assigneeId: string | null;
  assignee: IssueUser | null;

  reporterId: string;
  reporter: IssueUser | null;

  dueDate: string | null;

  createdAt: string;
  updatedAt: string;

  labels?: IssueLabel[];
}

export interface CreateIssueInput {
  title: string;
  description?: string;
  priority?: IssuePriority;
  status?: IssueStatus;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export interface UpdateIssueInput {
  title?: string;
  desc?: string;
  priority?: IssuePriority;
  status?: IssueStatus;
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
  unassigned?: boolean;
  labelId?: string;
  page?: number;
  limit?: number;
  sortBy?: IssueSortField;
  sortOrder?: SortOrder;
}

export interface IssuePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IssueUser {
  id: string;
  name: string;
  email: string;
}
