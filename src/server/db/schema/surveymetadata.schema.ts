import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

import { defaultRows } from "./shared";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { user } from "@/server/db/schema/user.schema";
import { relations } from "drizzle-orm";
import { survey } from "@/server/db/schema/survey.schema";
import { SURVEY_METADATA_TYPES_SCHEMA } from "@/server/db/schema/enums";

export const surveyMetadata = pgTable("survey_metadata", {
  ...defaultRows,
  surveyId: integer("survey_id")
    .notNull()
    .references(() => survey.id),
  createdById: integer("created_by_id")
    .notNull()
    .references(() => user.id),
  title: varchar("title", { length: 256 }).notNull(),
  description: varchar("description", { length: 1028 }),
  metadataType: SURVEY_METADATA_TYPES_SCHEMA("metadata_type")
    .notNull()
    .default("TEXT"),
});

export const surveyMetadataRelations = relations(surveyMetadata, ({ one }) => ({
  user: one(user, {
    fields: [surveyMetadata.createdById],
    references: [user.id],
  }),
  survey: one(survey, {
    fields: [surveyMetadata.surveyId],
    references: [survey.id],
  }),
}));

export const surveyMetadataInsertSchema = createInsertSchema(surveyMetadata);
export const surveyMetadataSelectSchema = createSelectSchema(surveyMetadata);
export type SurveyMetadataModel = z.infer<typeof surveyMetadataSelectSchema>;
