import {
  integer,
  pgTable,
  varchar,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";

import { defaultRows } from "./shared";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { user, type UserModel } from "@/server/db/schema/user.schema";
import { relations, sql } from "drizzle-orm";
import {
  question,
  type QuestionModel,
} from "@/server/db/schema/question.schema";
import { SURVEY_STATUS_SCHEMA } from "@/server/db/schema/enums";
import { surveyToRespondentUser } from "./survey-respondent.schema";
import { organisation } from "./organisation.schema";

export const survey = pgTable("survey", {
  ...defaultRows,
  createdById: integer("created_by_id")
    .notNull()
    .references(() => user.id),
  organisationId: integer("organisation_id")
    .notNull()
    .references(() => organisation.id),
  title: varchar("title", { length: 256 }).notNull(),
  uuid: uuid("uuid").notNull().defaultRandom().unique(),
  parentInstanceId: integer("parent_instance_id"),
  description: varchar("description", { length: 1028 }),
  surveyStatus: SURVEY_STATUS_SCHEMA("survey_status")
    .notNull()
    .default("DRAFT"),
  dueAt: timestamp("due_at").default(sql`null`),
});

export const surveyRelations = relations(survey, ({ one, many }) => ({
  user: one(user, {
    fields: [survey.createdById],
    references: [user.id],
  }),
  respondents: many(surveyToRespondentUser),
  questions: many(question),
  parentInstanceId: one(survey, {
    fields: [survey.parentInstanceId],
    references: [survey.id],
  }),
}));

export const surveyInsertSchema = createInsertSchema(survey);
export const surveySelectSchema = createSelectSchema(survey);
export type SurveyModel = z.infer<typeof surveySelectSchema>;
export type SurveyWithRelationsModel = SurveyModel & {
  user: UserModel;
  questions: QuestionModel[];
  // updateSurveyName: (surveyId: number, newName: string) => Promise<void>;
};
