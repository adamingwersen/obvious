import { z } from "zod";

export const formSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "5 characters or more",
    })
    .max(255, { message: "Max 255 characters" }),
  description: z.string(),
  dueAt: z.date().nullable(),
});

export type CreateSurveyFormFields = z.infer<typeof formSchema>;
