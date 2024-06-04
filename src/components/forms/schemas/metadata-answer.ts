import { METADATA_TYPES } from "@/server/db/schema/enums";
import { z } from "zod";

export const fieldSchema = z.object({
  response: z.string().min(1, { message: "Field is required" }),
  questionId: z.number().optional(),
  metadataType: z.enum(METADATA_TYPES),
});

export const metadataAnswerFormSchema = z.object({
  isTocChecked: z.boolean().default(false),
  data: z.array(fieldSchema),
});
export type CreateMetadataAnswerFormFields = z.infer<
  typeof metadataAnswerFormSchema
>;
