import { pgEnum } from "drizzle-orm/pg-core";
import { z } from "zod";

export const USER_PRIVILEGE = ["ORIGINATOR", "RESPONDENT"] as const;
export const USER_PRIVILEGE_SCHEMA = pgEnum("user_privilege", USER_PRIVILEGE);
const UserPrivilegeZodType = z.enum(USER_PRIVILEGE);
export type UserPrivilegeType = z.infer<typeof UserPrivilegeZodType>;
