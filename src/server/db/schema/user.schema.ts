import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { USER_PRIVILEGE_SCHEMA } from "./enums";
import { defaultRows } from "./shared";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const user = pgTable("user", {
  ...defaultRows,
  authId: uuid("auth_id"), // null = user hasn't signed up from email link
  email: varchar("email", { length: 256 }).notNull(),
  firstName: varchar("first_name", { length: 256 }),
  lastName: varchar("last_name", { length: 256 }),
  privilege: USER_PRIVILEGE_SCHEMA("privilege").notNull().default("RESPONDENT"),
});

export const userInsertSchema = createInsertSchema(user);
export const userSelectSchema = createSelectSchema(user);
export type UserModel = z.infer<typeof userSelectSchema>;
