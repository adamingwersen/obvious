import { integer, pgTable, varchar, uuid } from "drizzle-orm/pg-core";

import { defaultRows } from "./shared";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { user } from "@/server/db/schema/user.schema";
import { relations } from "drizzle-orm";
import { question } from "@/server/db/schema/question.schema";

export const survey = pgTable("survey", {
  ...defaultRows,
  createdById: integer("created_by_id")
    .notNull()
    .references(() => user.id),
  title: varchar("title", { length: 256 }).notNull(),
  uuid: uuid("uuid").notNull().defaultRandom().unique(),
  parentInstanceId: integer("parent_instance_id"),
});

export const surveyRelations = relations(survey, ({ one, many }) => ({
  user: one(user, {
    fields: [survey.createdById],
    references: [user.id],
  }),
  questions: many(question),
  parentInstanceId: one(survey, {
    fields: [survey.parentInstanceId],
    references: [survey.id],
  }),
}));

export const surveyInsertSchema = createInsertSchema(survey);
export const surveySelectSchema = createSelectSchema(survey);
export type SurveyModel = z.infer<typeof surveySelectSchema>;
