import {
  integer,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./user.schema";
import { survey } from "./survey.schema";
import { relations, sql } from "drizzle-orm";
import { createdUpdatedTime } from "./shared";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// This models the respondents to a survey
export const surveyToRespondentUser = pgTable(
  "survey_to_respondent_user",
  {
    ...createdUpdatedTime,
    respondentUserId: integer("respondent_user_id")
      .notNull()
      .references(() => user.id),
    invitedById: integer("invited_by_id")
      .notNull()
      .references(() => user.id),
    surveyId: integer("survey_id")
      .notNull()
      .references(() => survey.id),
    respondentFirstSeenAt: timestamp("respondent_first_seen_at").default(
      sql`null`,
    ),
    surveyAccessToken: varchar("survey_access_token").default(sql`null`),
    uuid: uuid("uuid").notNull().defaultRandom().unique(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.respondentUserId, t.surveyId] }),
  }),
);

export const surveyRespondentRelations = relations(
  surveyToRespondentUser,
  ({ one }) => ({
    respondent: one(user, {
      fields: [surveyToRespondentUser.respondentUserId],
      references: [user.id],
    }),
    survey: one(survey, {
      fields: [surveyToRespondentUser.surveyId],
      references: [survey.id],
    }),
    invitedBy: one(user, {
      fields: [surveyToRespondentUser.invitedById],
      references: [user.id],
    }),
  }),
);

// export const surveyRespondentRelations = relations(
//   surveyToRespondentUser,
//   ({ many }) => ({
//     users: many(user),
//   }),
// );
export const surveyRespondentInsertSchema = createInsertSchema(
  surveyToRespondentUser,
);
export const surveyRespondentSelectSchema = createSelectSchema(
  surveyToRespondentUser,
);
export type SurveyRespondentModel = z.infer<
  typeof surveyRespondentSelectSchema
>;
