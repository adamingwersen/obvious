import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { eq, schema } from "@/server/db";

type SendEmailRequest = {
  email: string;
  magicLink: string;
};

export const serviceResendRouter = createTRPCRouter({
  sendEmail: procedures.protected.input(SendEmailRequest),
});
