import { sql } from "drizzle-orm";
import { serial, timestamp } from "drizzle-orm/pg-core";

export const createdUpdatedTime = {
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at").default(sql`null`),
};

export const defaultRows = {
  id: serial("id").notNull().primaryKey(),
  ...createdUpdatedTime,
} as const;
