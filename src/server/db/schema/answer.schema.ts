import { integer, pgTable, text } from "drizzle-orm/pg-core";

import { defaultRows } from "./shared";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { question } from "@/server/db/schema/question.schema";
import { respondent } from "./respondent.schema";

export const answer = pgTable("answer", {
  ...defaultRows,
  content: text("content").notNull(),
  documentUrls: text("document_urls").array(),
  questionId: integer("question_id")
    .notNull()
    .references(() => question.id),
  createdById: integer("created_by_id")
    .notNull()
    .references(() => respondent.id),
});

export const answerRelations = relations(answer, ({ one }) => ({
  respondent: one(respondent, {
    fields: [answer.createdById],
    references: [respondent.id],
  }),
  question: one(question, {
    fields: [answer.questionId],
    references: [question.id],
  }),
}));

export const answerInsertSchema = createInsertSchema(answer, {
  documentUrls: z.array(z.string()),
});
export const answerSelectSchema = createSelectSchema(answer, {
  documentUrls: z.array(z.string()),
});
export type AnswerModel = z.infer<typeof answerSelectSchema>;
