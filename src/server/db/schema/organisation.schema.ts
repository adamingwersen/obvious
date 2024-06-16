import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { defaultRows } from "./shared";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import {
  COUNTRY_TYPES_SCHEMA,
  INDUSTRY_TYPES_SCHEMA,
  ORGANISATION_SIZE_TYPES_SCHEMA,
} from "@/server/db/schema/enums";
import { relations } from "drizzle-orm";
import { user } from "@/server/db/schema/user.schema";

export const organisation = pgTable("organisation", {
  ...defaultRows,
  uuid: uuid("uuid").notNull().defaultRandom().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  size: ORGANISATION_SIZE_TYPES_SCHEMA("size"),
  headquarters: COUNTRY_TYPES_SCHEMA("headquarters"),
  industry: INDUSTRY_TYPES_SCHEMA("industry"),
});

export const organisationRelations = relations(organisation, ({ many }) => ({
  users: many(user),
}));

export const organisationInsertSchema = createInsertSchema(organisation);
export const organisationSelectSchema = createSelectSchema(organisation);
export type OrganisationModel = z.infer<typeof organisationSelectSchema>;
