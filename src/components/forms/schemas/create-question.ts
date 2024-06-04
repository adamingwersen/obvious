import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(10),
});

export type CreateQuestionFormFields = z.infer<typeof formSchema>;
