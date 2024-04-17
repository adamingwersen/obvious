import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { defaultRows } from "./shared";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { user } from "@/server/db/schema/user.schema";
import { relations } from "drizzle-orm";
import { question } from "@/server/db/schema/question.schema";

export const survey = pgTable("survey", {
  ...defaultRows,
  createdById: uuid("created_by_id")
    .notNull()
    .references(() => user.id),
  title: varchar("title", { length: 256 }).notNull(),
});

export const surveyRelations = relations(survey, ({ one, many }) => ({
  user: one(user, {
    fields: [survey.createdById],
    references: [user.id],
  }),
  questions: many(question),
}));

export const surveyInsertSchema = createInsertSchema(survey);
export const surveySelectSchema = createSelectSchema(survey);
export type SurveyModel = z.infer<typeof surveySelectSchema>;
