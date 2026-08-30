import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const organizations = pgTable(
  "organizations",
  {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 250 }).notNull(),
    slug: varchar({ length: 250 }).notNull().unique(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("org_name_idx").on(table.name)],
);

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
