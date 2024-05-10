import { pgEnum } from "drizzle-orm/pg-core";
import { z } from "zod";

export const SURVEY_STATUS = ["DRAFT", "ACTIVE", "PAUSED", "ARCHIVED"] as const;
export const SURVEY_STATUS_SCHEMA = pgEnum("survey_status", SURVEY_STATUS);
const SurveyStatusZodType = z.enum(SURVEY_STATUS);
export type SurveyStatusType = z.infer<typeof SurveyStatusZodType>;

export const USER_PRIVILEGE = ["ORIGINATOR", "RESPONDENT"] as const;
export const USER_PRIVILEGE_SCHEMA = pgEnum("user_privilege", USER_PRIVILEGE);
const UserPrivilegeZodType = z.enum(USER_PRIVILEGE);
export type UserPrivilegeType = z.infer<typeof UserPrivilegeZodType>;

export const SURVEY_METADATA_TYPES = [
  "NUMBER",
  "RANGE",
  "TEXT",
  "URL",
  "EMAIL",
] as const;
export const SURVEY_METADATA_TYPES_SCHEMA = pgEnum(
  "survey_metadata_types",
  SURVEY_METADATA_TYPES,
);
const SurveyMetadataTypesZodType = z.enum(SURVEY_METADATA_TYPES);
export type SurveyMetadataType = z.infer<typeof SurveyMetadataTypesZodType>;
