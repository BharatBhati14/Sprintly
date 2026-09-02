import { pgTable, primaryKey, unique, uuid } from "drizzle-orm/pg-core";
import { issues } from "./issues";
import { labels } from "./labels";

export const issueLabels = pgTable(
  "issue_labels",
  {
    issue_id: uuid("issue_id")
      .notNull()
      .references(() => issues.id, {
        onDelete: "cascade",
      }),

    label_id: uuid("label_id")
      .notNull()
      .references(() => labels.id, {
        onDelete: "cascade",
      }),
  },
  (table) => [
    primaryKey({
      name: "issue_label_pk",
      columns: [table.issue_id, table.label_id],
    }),
  ],
);

export type IssueLabel = typeof issueLabels.$inferSelect;
export type NewIssueLabel = typeof issueLabels.$inferInsert;
