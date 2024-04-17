import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { schema } from "@/server/db";
import { surveyInsertSchema } from "@/server/db/schema";

export const surveyRouter = createTRPCRouter({
  create: procedures.protected
    .input(surveyInsertSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(schema.survey).values({ ...input });
    }),
});
