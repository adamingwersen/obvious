import { organisationInsertSchema, userInsertSchema } from "@/server/db/schema";
import { z } from "zod";

export const userFormSchema = userInsertSchema.pick({
  email: true,
  firstName: true,
  lastName: true,
  describedRole: true,
});

export const orgFormSchema = organisationInsertSchema.pick({
  name: true,
  headquarters: true,
  industry: true,
  size: true,
});

export const formSchema = z.intersection(userFormSchema, orgFormSchema);

export type SettingsFormField = z.infer<typeof formSchema>;
