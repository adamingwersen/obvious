import { boolean, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

import { defaultRows } from "./shared";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { user } from "@/server/db/schema/user.schema";
import { relations } from "drizzle-orm";
import { answer } from "@/server/db/schema/answer.schema";
import { survey } from "@/server/db/schema/survey.schema";

export const question = pgTable("question", {
  ...defaultRows,
  title: varchar("title", { length: 256 }).notNull(),
  content: text("content").notNull(),
  forwardable: boolean("forwardable").notNull().default(true),
  createdById: integer("created_by_id")
    .notNull()
    .references(() => user.id),
  surveyId: integer("survey_id")
    .notNull()
    .references(() => survey.id),
  topicTag: text("topic_tag"),
  disclosureRequirementTag: text("disclosure_requirement_tag"), // Disclosure requiremenet
  datapointTag: text("datapoint_tag"), // Datapoint id
  dataType: text("data_type"),
  dataUnit: text("data_unit"),
});

export const questionRelations = relations(question, ({ one, many }) => ({
  user: one(user, {
    fields: [question.createdById],
    references: [user.id],
  }),
  survey: one(survey, {
    fields: [question.surveyId],
    references: [survey.id],
  }),
  answers: many(answer),
}));

export const questionInsertSchema = createInsertSchema(question);
export const questionSelectSchema = createSelectSchema(question);

export type QuestionModel = z.infer<typeof questionSelectSchema>;
