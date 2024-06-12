import {
  AnyPgColumn,
  integer,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { ROLE_TYPES_SCHEMA, USER_PRIVILEGE_SCHEMA } from "./enums";
import { defaultRows } from "./shared";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { organisation } from "@/server/db/schema/organisation";
import { relations } from "drizzle-orm";

export const user = pgTable("user", {
  ...defaultRows,
  authId: uuid("auth_id").notNull(), // null = user hasn't signed up from email link
  email: varchar("email", { length: 256 }).notNull(),
  firstName: varchar("first_name", { length: 256 }),
  lastName: varchar("last_name", { length: 256 }),
  privilege: USER_PRIVILEGE_SCHEMA("privilege").notNull().default("RESPONDENT"),
  organisationRole: ROLE_TYPES_SCHEMA("organisation_role")
    .notNull()
    .default("USER"),
  organisationId: integer("organisation_id")
    .notNull()
    .references(() => organisation.id),
  invitedById: integer("invited_by_id").references((): AnyPgColumn => user.id),
});

export const userRelations = relations(user, ({ one }) => ({
  organisation: one(organisation, {
    fields: [user.organisationId],
    references: [organisation.id],
  }),
  invitedBy: one(user, {
    fields: [user.invitedById],
    references: [user.id],
  }),
}));

export const userInsertSchema = createInsertSchema(user);
export const userSelectSchema = createSelectSchema(user);
export type UserModel = z.infer<typeof userSelectSchema>;
