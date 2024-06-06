import { z } from "zod";

export const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const formSchemaWithPasswordRequirements = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Passwords are at least 8 characters" }),
});

export type AuthFormFields = z.infer<typeof formSchema>;
