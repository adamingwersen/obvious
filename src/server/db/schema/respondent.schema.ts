import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

import { defaultRows } from "./shared";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { survey, user } from "@/server/db/schema";

export const respondent = pgTable("respondent", {
  ...defaultRows,
  authId: uuid("auth_id"), // null = user hasn't signed up from email link
  firstSeenAt: timestamp("first_seen_at").default(sql`null`),
  email: varchar("email", { length: 256 }).notNull(),
  invitedById: integer("invited_by_id").notNull(),
  surveyId: integer("survey_id").notNull(),
});

export const respondentRelations = relations(respondent, ({ one }) => ({
  invitedById: one(user, {
    fields: [respondent.invitedById],
    references: [user.id],
  }),
  surveyId: one(survey, {
    fields: [respondent.surveyId],
    references: [survey.id],
  }),
}));

export const respondentInsertSchema = createInsertSchema(respondent);
export const respondentSelectSchema = createSelectSchema(respondent);
export type RespondentModel = z.infer<typeof respondentSelectSchema>;
