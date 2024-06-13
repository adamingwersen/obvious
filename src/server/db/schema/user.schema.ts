import {
  AnyPgColumn,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { ROLE_TYPES_SCHEMA, USER_PRIVILEGE_SCHEMA } from "./enums";
import { defaultRows } from "./shared";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { organisation } from "@/server/db/schema/organisation.schema";
import { relations, sql } from "drizzle-orm";
import { survey } from "./survey.schema";

export const user = pgTable("user", {
  ...defaultRows,
  authId: uuid("auth_id"), // null = user hasn't signed up from email link
  email: varchar("email", { length: 256 }).notNull(),
  firstName: varchar("first_name", { length: 256 }),
  lastName: varchar("last_name", { length: 256 }),
  surveyId: integer("survey_id").references((): AnyPgColumn => survey.id), // If user is tied to survey, not sure if this is needed
  privilege: USER_PRIVILEGE_SCHEMA("privilege").notNull().default("RESPONDENT"),
  organisationRole: ROLE_TYPES_SCHEMA("organisation_role")
    .notNull()
    .default("USER"),
  organisationId: integer("organisation_id")
    .notNull()
    .references(() => organisation.id),
  invitedById: integer("invited_by_id").references((): AnyPgColumn => user.id),
  firstSeenAt: timestamp("first_seen_at").default(sql`null`),
  uuid: uuid("uuid").notNull().defaultRandom().unique(),
  accessToken: varchar("access_token").default(sql`null`),
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
  survey: one(survey, {
    fields: [user.surveyId],
    references: [survey.id],
  }),
}));

export const userInsertSchema = createInsertSchema(user);
export const userSelectSchema = createSelectSchema(user);
export type UserModel = z.infer<typeof userSelectSchema>;
