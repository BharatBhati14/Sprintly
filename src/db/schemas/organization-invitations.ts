import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { users } from "./users";

export const organizationInvitations = pgTable(
  "organization_invitations",
  {
    id: uuid("id").defaultRandom().notNull().primaryKey(),

    org_id: uuid("org_id")
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
      }),

    email: varchar("email", { length: 250 }).notNull(),

    token: varchar("token", { length: 64 }).notNull().unique(),

    expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),

    invited_by: uuid("invited_by")
      .notNull()
      .references(() => users.id),

    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    accepted_at: timestamp("accepted_at", { withTimezone: true }),
  },
  (table) => ({
    orgIdIdx: index("org_invitations_org_id_idx").on(table.org_id),
    emailIdx: index("org_invitations_email_idx").on(table.email),
  }),
);

export type OrganizationInvitation =
  typeof organizationInvitations.$inferSelect;
export type NewOrganizationInvitation =
  typeof organizationInvitations.$inferInsert;
