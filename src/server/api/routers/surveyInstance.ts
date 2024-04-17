import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { schema } from "@/server/db";
import { surveyInstanceInsertSchema } from "@/server/db/schema";

export const surveyInstanceRouter = createTRPCRouter({
  create: procedures.protected
    .input(surveyInstanceInsertSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(schema.surveyInstance).values({ ...input });
    }),
});
