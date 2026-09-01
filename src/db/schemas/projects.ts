import {
  pgEnum,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const projectStatusEnum = pgEnum("project_status", [
  "ACTIVE",
  "ARCHIVED",
]);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),

    org_id: uuid("org_id")
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
      }),

    name: varchar("name", { length: 250 }).notNull(),

    description: varchar("description", { length: 1000 }),

    key: varchar("key", { length: 50 }).notNull(),

    status: projectStatusEnum("status").notNull().default("ACTIVE"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("project_org_key_unique").on(table.org_id, table.key)],
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
