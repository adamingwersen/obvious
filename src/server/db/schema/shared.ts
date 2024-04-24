import { sql } from "drizzle-orm";
import { serial, timestamp } from "drizzle-orm/pg-core";

export const createdUpdatedTime = {
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // archivedAt
};

export const defaultRows = {
  id: serial("id").notNull().primaryKey(),
  ...createdUpdatedTime,
} as const;
