import { pgTable, uuid } from "drizzle-orm/pg-core";

import { defaultRows } from "./shared";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { user } from "@/server/db/schema/user.schema";
import { relations } from "drizzle-orm";
import { question } from "@/server/db/schema/question.schema";
import { survey } from "@/server/db/schema/survey.schema";

export const surveyInstance = pgTable("survey_instance", {
  ...defaultRows,
  surveyId: uuid("survey_id")
    .notNull()
    .references(() => survey.id),
  createdById: uuid("created_by_id")
    .notNull()
    .references(() => user.id),
  parentInstanceId: uuid("parent_instance_id"),
});

export const surveyInstanceRelations = relations(
  surveyInstance,
  ({ one, many }) => ({
    user: one(user, {
      fields: [surveyInstance.createdById],
      references: [user.id],
    }),
    survey: one(survey, {
      fields: [surveyInstance.surveyId],
      references: [survey.id],
    }),
    parentInstanceId: one(surveyInstance, {
      fields: [surveyInstance.parentInstanceId],
      references: [surveyInstance.id],
    }),
    questions: many(question),
  }),
);

export const surveyInstanceInsertSchema = createInsertSchema(surveyInstance);
export const surveyInstanceSelectSchema = createSelectSchema(surveyInstance);
export type SurveyInstanceModel = z.infer<typeof surveyInstanceSelectSchema>;
