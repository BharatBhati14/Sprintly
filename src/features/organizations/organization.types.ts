export type OrganizationRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  role: OrganizationRole;
}

export interface OrganizationMember {
  userId: string;
  name: string;
  email: string;
  role: OrganizationRole;
  joinedAt: string;
}

export interface CreateOrganizationInput {
  name: string;
  slug?: string;
}

export interface UpdateOrganizationInput {
  name?: string;
  slug?: string;
}

export interface UpdateMemberRoleInput {
  role: OrganizationRole;
}
