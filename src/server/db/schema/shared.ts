import { sql } from "drizzle-orm";
import { timestamp, uuid } from "drizzle-orm/pg-core";

export const createdUpdatedTime = {
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
};

export const defaultRows = {
  id: uuid("id").notNull().primaryKey(),
  ...createdUpdatedTime,
} as const;
