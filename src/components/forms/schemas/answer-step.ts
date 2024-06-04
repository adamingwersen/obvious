import { z } from "zod";

export const formSchema = z.object({
  content: z.string().min(10),
});

export type CreateAnswerFormFields = z.infer<typeof formSchema>;
