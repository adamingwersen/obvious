import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { defaultRows } from "./shared";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "@/server/db/schema/user.schema";
import { relations } from "drizzle-orm";
import { question } from "@/server/db/schema/question.schema";

export const answer = pgTable("answer", {
  ...defaultRows,
  content: text("content").notNull(),
  documentIds: text("document_ids").array(),
  questionId: uuid("question_id")
    .notNull()
    .references(() => question.id),
  createdById: uuid("created_by_id")
    .notNull()
    .references(() => user.id),
});

export const answerRelations = relations(answer, ({ one }) => ({
  user: one(user, {
    fields: [answer.createdById],
    references: [user.id],
  }),
  question: one(question, {
    fields: [answer.questionId],
    references: [question.id],
  }),
}));

export const answerInsertSchema = createInsertSchema(answer, {
  documentIds: z.array(z.string()),
});
export const answerSelectSchema = createSelectSchema(answer);
export type AnswerModel = z.infer<typeof answerSelectSchema>;
