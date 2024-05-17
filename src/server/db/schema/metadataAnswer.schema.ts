import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

import { defaultRows } from "./shared";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { relations } from "drizzle-orm";
import { survey } from "@/server/db/schema/survey.schema";
import { METADATA_TYPES_SCHEMA } from "@/server/db/schema/enums";
import { respondent } from "@/server/db/schema/respondent.schema";
import { metadataQuestion } from "@/server/db/schema/metadataQuestion.schema";

export const metadataAnswer = pgTable("metadata_answer", {
  ...defaultRows,
  surveyId: integer("survey_id")
    .notNull()
    .references(() => survey.id),
  metadataQuestionId: integer("metadata_question_id")
    .notNull()
    .references(() => metadataQuestion.id),
  createdById: integer("created_by_id")
    .notNull()
    .references(() => respondent.id),
  response: varchar("response").notNull(),
  metadataType: METADATA_TYPES_SCHEMA("metadata_type").notNull(),
});

export const metadataAnswerRelations = relations(metadataAnswer, ({ one }) => ({
  respondent: one(respondent, {
    fields: [metadataAnswer.createdById],
    references: [respondent.id],
  }),
  survey: one(survey, {
    fields: [metadataAnswer.surveyId],
    references: [survey.id],
  }),
  metadataQuestion: one(metadataQuestion, {
    fields: [metadataAnswer.metadataQuestionId],
    references: [metadataQuestion.id],
  }),
}));

export const metadataAnswerInsertSchema = createInsertSchema(metadataAnswer);
export const metadataAnswerSelectSchema = createSelectSchema(metadataAnswer);
export type MetadataAnswerModel = z.infer<typeof metadataAnswerSelectSchema>;
