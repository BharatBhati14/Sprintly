export interface DashboardStatusCounts {
  BACKLOG: number;
  TODO: number;
  IN_PROGRESS: number;
  IN_REVIEW: number;
  DONE: number;
}

export interface DashboardIssue {
  id: string;
  organizationId: string;
  projectId: string;
  projectKey: string;
  projectName: string;
  number: number;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
  assigneeId: string | null;
  createdAt: string;
}

export interface DashboardProject {
  id: string;
  organizationId: string;
  organizationName: string;
  name: string;
  key: string;
  status: string;
  issueCount: number;
  createdAt: string;
}

export interface DashboardData {
  totals: {
    projects: number;
    openIssues: number;
    assignedToMe: number;
    dueSoon: number;
  };

  issueStatusCounts: DashboardStatusCounts;

  recentIssues: DashboardIssue[];

  recentProjects: DashboardProject[];
}
