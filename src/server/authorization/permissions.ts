import { organizationMemberRoleEnum } from "@/db/schemas";

type OrganizationRole = (typeof organizationMemberRoleEnum.enumValues)[number];

export const permissions = {
  organization: {
    read: "organization.read",
    update: "organization.update",
    delete: "organization.delete",
  },

  member: {
    read: "member.read",
    invite: "member.invite",
    remove: "member.remove",
    changeRole: "member.change_role",
  },

  project: {
    read: "project.read",
    create: "project.create",
    update: "project.update",
    archive: "project.archive",
    delete: "project.delete",
  },

  issue: {
    read: "issue.read",
    create: "issue.create",
    update: "issue.update",
    delete: "issue.delete",
    assign: "issue.assign",
    changeStatus: "issue.change_status",
    changePriority: "issue.change_priority",
  },

  label: {
    read: "label.read",
    create: "label.create",
    update: "label.update",
    delete: "label.delete",
  },
} as const;

export type Permission = {
  [Category in keyof typeof permissions]: (typeof permissions)[Category][keyof (typeof permissions)[Category]];
}[keyof typeof permissions];

const allPermissions: Permission[] = [
  permissions.organization.read,
  permissions.organization.update,
  permissions.organization.delete,

  permissions.member.read,
  permissions.member.invite,
  permissions.member.remove,
  permissions.member.changeRole,

  permissions.project.read,
  permissions.project.create,
  permissions.project.update,
  permissions.project.archive,
  permissions.project.delete,

  permissions.issue.read,
  permissions.issue.create,
  permissions.issue.update,
  permissions.issue.delete,
  permissions.issue.assign,
  permissions.issue.changeStatus,
  permissions.issue.changePriority,

  permissions.label.read,
  permissions.label.create,
  permissions.label.update,
  permissions.label.delete,
];

export const rolePermissions: Record<
  OrganizationRole,
  ReadonlySet<Permission>
> = {
  OWNER: new Set(allPermissions),

  ADMIN: new Set([
    permissions.organization.read,
    permissions.organization.update,

    permissions.member.read,
    permissions.member.invite,
    permissions.member.remove,
    permissions.member.changeRole,

    permissions.project.read,
    permissions.project.create,
    permissions.project.update,
    permissions.project.archive,
    permissions.project.delete,

    permissions.issue.read,
    permissions.issue.create,
    permissions.issue.update,
    permissions.issue.delete,
    permissions.issue.assign,
    permissions.issue.changeStatus,
    permissions.issue.changePriority,

    permissions.label.read,
    permissions.label.create,
    permissions.label.update,
    permissions.label.delete,
  ]),

  MEMBER: new Set([
    permissions.organization.read,
    permissions.member.read,

    permissions.project.read,
    permissions.project.create,
    permissions.project.update,
    permissions.project.archive,
    permissions.project.delete,

    permissions.issue.read,
    permissions.issue.create,
    permissions.issue.update,
    permissions.issue.assign,
    permissions.issue.changeStatus,
    permissions.issue.changePriority,

    permissions.label.read,
    permissions.label.create,
    permissions.label.update,
  ]),

  VIEWER: new Set([
    permissions.organization.read,
    permissions.member.read,
    permissions.project.read,
    permissions.issue.read,
    permissions.label.read,
  ]),
};
