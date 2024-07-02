import { questionInsertSchema } from "@/server/db/schema";
import { z } from "zod";

export const formSchema = questionInsertSchema.extend({
  title: z.string().min(5),
  content: z.string().min(10),
  surveyId: z.number().positive().optional(), // Not part of form
  createdById: z.number().positive().optional(), // This will be infered from requester
});

export type upsertQuestionType = z.infer<typeof formSchema>;

export const questionUpsertSchema = z.array(formSchema);

export type upsertQuestionsType = z.infer<typeof questionUpsertSchema>;
