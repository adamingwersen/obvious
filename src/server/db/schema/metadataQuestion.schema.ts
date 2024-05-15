import { MetadataQuestionModel } from "@/server/db/schema";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

import { defaultRows } from "./shared";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { user } from "@/server/db/schema/user.schema";
import { relations } from "drizzle-orm";
import { survey } from "@/server/db/schema/survey.schema";
import { METADATA_TYPES_SCHEMA } from "@/server/db/schema/enums";

export const metadataQuestion = pgTable("metadata_question", {
  ...defaultRows,
  surveyId: integer("survey_id")
    .notNull()
    .references(() => survey.id),
  createdById: integer("created_by_id")
    .notNull()
    .references(() => user.id),
  title: varchar("title", { length: 256 }).notNull(),
  description: varchar("description", { length: 1028 }),
  metadataType: METADATA_TYPES_SCHEMA("metadata_type")
    .notNull()
    .default("TEXT"),
});

export const metadataQuestionRelations = relations(
  metadataQuestion,
  ({ one }) => ({
    user: one(user, {
      fields: [metadataQuestion.createdById],
      references: [user.id],
    }),
    survey: one(survey, {
      fields: [metadataQuestion.surveyId],
      references: [survey.id],
    }),
  }),
);

export const metadataQuestionInsertSchema =
  createInsertSchema(metadataQuestion);
export const metadataQuestionSelectSchema =
  createSelectSchema(metadataQuestion);
export type MetadataQuestionModel = z.infer<
  typeof metadataQuestionSelectSchema
>;
