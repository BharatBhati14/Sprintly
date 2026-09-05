import {
  index,
  pgEnum,
  pgTable,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { users } from "./users";

export const organizationMemberRoleEnum = pgEnum("member_role", [
  "OWNER",
  "ADMIN",
  "MEMBER",
  "VIEWER",
]);

export const organization_members = pgTable(
  "organization_members",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    organization_id: uuid()
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    user_id: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),

    role: organizationMemberRoleEnum().notNull(),

    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique("org_member_unique").on(table.organization_id, table.user_id),
    index("org_member_user_idx").on(table.user_id),
  ],
);

export type OrganizationMember = typeof organization_members.$inferSelect;
export type NewOrganizationMember = typeof organization_members.$inferInsert;
