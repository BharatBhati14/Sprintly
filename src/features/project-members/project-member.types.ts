export interface ProjectMember {
  userId: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AddProjectMemberInput {
  userId: string;
}
