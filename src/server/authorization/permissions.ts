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
    delete: "project.delete",
  },

  issue: {
    read: "issue.read",
    create: "issue.create",
    update: "issue.update",
    delete: "issue.delete",
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
  permissions.project.delete,

  permissions.issue.read,
  permissions.issue.create,
  permissions.issue.update,
  permissions.issue.delete,
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
    permissions.project.delete,

    permissions.issue.read,
    permissions.issue.create,
    permissions.issue.update,
    permissions.issue.delete,
  ]),

  MEMBER: new Set([
    permissions.organization.read,
    permissions.member.read,

    permissions.project.read,
    permissions.project.create,
    permissions.project.update,
    permissions.project.delete,

    permissions.issue.read,
    permissions.issue.create,
    permissions.issue.update,
    permissions.issue.delete,
  ]),

  VIEWER: new Set([
    permissions.organization.read,
    permissions.member.read,
    permissions.project.read,
    permissions.issue.read,
  ]),
};
