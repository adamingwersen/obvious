import { z } from "zod";

export const formSchema = z
  .object({
    emails: z.array(
      z.object({
        id: z.number().optional(),
        email: z.string().email(),
        surveyId: z.number(),
      }),
    ),
  })
  .refine(
    (data) => {
      return data.emails.length !== 0;
    },
    {
      message: `No existing emails found`,
    },
  );

export type ShareFormFields = z.infer<typeof formSchema>;
