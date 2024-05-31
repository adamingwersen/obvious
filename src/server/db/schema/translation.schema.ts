import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { defaultRows } from "./shared";
import { user } from "@/server/db/schema/user.schema";
import { answer } from "@/server/db/schema/answer.schema";
import { question } from "@/server/db/schema/question.schema";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const translation = pgTable("translation", {
  ...defaultRows,
  translatedContent: text("tranlated_content").notNull(),
  language: varchar("langauage", { length: 128 }).notNull(),
  createdById: integer("created_by_id")
    .notNull()
    .references(() => user.id),
  answerId: integer("answer_id").references(() => answer.id),
  questionId: integer("question_id").references(() => question.id),
});

// TODO: I dont know what this is for, seems like relations are already defined in the above
// Also dont know how to do the optional relationship
export const translationRelations = relations(translation, ({ one }) => ({
  user: one(user, {
    fields: [translation.createdById],
    references: [user.id],
  }),
}));

export const translationInsertSchema = createInsertSchema(translation);
export const translationSelectSchema = createSelectSchema(translation);
export type TranslationModel = z.infer<typeof translationSelectSchema>;
