import { boolean, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

import { defaultRows } from "./shared";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { user } from "@/server/db/schema/user.schema";
import { relations } from "drizzle-orm";
import { answer } from "@/server/db/schema/answer.schema";

export const question = pgTable("question", {
  ...defaultRows,
  title: varchar("title", { length: 256 }).notNull(),
  content: text("content").notNull(),
  forwardable: boolean("forwardable").notNull(),
  createdById: uuid("created_by_id")
    .notNull()
    .references(() => user.id),
});

export const questionRelations = relations(question, ({ one, many }) => ({
  user: one(user, {
    fields: [question.createdById],
    references: [user.id],
  }),
  answers: many(answer),
}));

export const questionInsertSchema = createInsertSchema(question);
export const questionSelectSchema = createSelectSchema(question);
export type QuestionModel = z.infer<typeof questionSelectSchema>;
