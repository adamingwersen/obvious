import { METADATA_TYPES } from "@/server/db/schema/enums";
import { z } from "zod";

export const formSchema = z.object({
  metadataQuestionFields: z.array(
    z.object({
      title: z.string().min(5),
      metadataType: z.enum(METADATA_TYPES),
      id: z.number().optional(),
    }),
  ),
});

export type CreateMetadataQuestionFormFields = z.infer<typeof formSchema>;
