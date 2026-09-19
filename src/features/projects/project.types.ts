export type ProjectStatus = "ACTIVE" | "ARCHIVED";

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  key: string;
  description: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  key: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  key?: string;
}

export interface ProjectPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
