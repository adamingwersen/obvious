import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { schema } from "@/server/db";
import { questionInsertSchema } from "@/server/db/schema";

export const questionRouter = createTRPCRouter({
  create: procedures.protected
    .input(questionInsertSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(schema.question).values({ ...input });
    }),
});
