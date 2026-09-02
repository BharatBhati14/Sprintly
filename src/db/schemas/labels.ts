import { pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const labels = pgTable(
  "labels",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),

    org_id: uuid("org_id")
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade"
      }),

    name: varchar("name", { length: 100 }).notNull(),

    color: varchar("color", {length: 20}),

    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("label_org_name_unique").on(table.org_id, table.name)],
);

export type Label = typeof labels.$inferSelect;
export type NewLabel = typeof labels.$inferInsert;
