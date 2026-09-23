export interface Label {
  id: string;
  organizationId: string;
  name: string;
  color: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IssueLabel {
  id: string;
  issueId: string;
  labelId: string;
}
