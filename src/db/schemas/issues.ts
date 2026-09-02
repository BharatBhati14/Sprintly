import {
  date,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { users } from "./users";

export const issueStatusEnum = pgEnum("issue_status", [
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
]);

export const issuePriorityEnum = pgEnum("issue_priority", [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
]);

export const issues = pgTable(
  "issues",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),

    project_id: uuid("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),

    number: integer("number").notNull(),

    title: varchar("title", { length: 150 }).notNull(),

    desc: varchar("desc", { length: 500 }),

    status: issueStatusEnum("status").notNull().default("TODO"),

    priority: issuePriorityEnum("priority").notNull().default("LOW"),

    assignee_id: uuid("assignee_id").references(() => users.id, {
      onDelete: "set null",
    }),

    reporter_id: uuid("reporter_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    due_date: date("due_date"),

    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("issue_project_number_unique").on(table.project_id, table.number),
  ],
);

export type Issue = typeof issues.$inferSelect;
export type NewIssue = typeof issues.$inferInsert;
