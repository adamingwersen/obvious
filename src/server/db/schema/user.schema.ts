import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { ROLE_TYPES_SCHEMA, USER_PRIVILEGE_SCHEMA } from "./enums";
import { defaultRows } from "./shared";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { organisation } from "@/server/db/schema/organisation.schema";
import { relations } from "drizzle-orm";
import { survey } from "./survey.schema";
import { surveyToRespondentUser } from "./survey-respondent.schema";

export const user = pgTable("user", {
  ...defaultRows,
  authId: uuid("auth_id"), // null = user hasn't signed up from email link
  email: varchar("email", { length: 256 }).notNull().unique(),
  firstName: varchar("first_name", { length: 256 }),
  lastName: varchar("last_name", { length: 256 }),
  privilege: USER_PRIVILEGE_SCHEMA("privilege").notNull().default("RESPONDENT"),
  organisationRole: ROLE_TYPES_SCHEMA("organisation_role")
    .notNull()
    .default("USER"),
  describedRole: varchar("described_role", { length: 256 }).default(""),
  organisationId: integer("organisation_id").references(() => organisation.id),
  uuid: uuid("uuid").notNull().defaultRandom().unique(),
});

export const userRelations = relations(user, ({ one, many }) => ({
  organisation: one(organisation, {
    fields: [user.organisationId],
    references: [organisation.id],
  }),
  createdSurveys: many(survey, { relationName: "survey_inviter" }),
  respondentSurveys: many(surveyToRespondentUser, {
    relationName: "survey_respondent",
  }),
}));

export const userInsertSchema = createInsertSchema(user);
export const userSelectSchema = createSelectSchema(user);
export type UserModel = z.infer<typeof userSelectSchema>;
