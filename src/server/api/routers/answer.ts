import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { schema } from "@/server/db";
import { answerInsertSchema } from "@/server/db/schema";

export const answerRouter = createTRPCRouter({
  create: procedures.protected
    .input(answerInsertSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(schema.answer).values({ ...input });
    }),
});
