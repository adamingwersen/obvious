import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { eq, schema } from "@/server/db";
import { answerInsertSchema } from "@/server/db/schema";

const answerCreateSchema = answerInsertSchema.pick({
  content: true,
  questionId: true,
});
const answerUpdateSchema = answerInsertSchema.pick({
  content: true,
  id: true,
});

export const answerRouter = createTRPCRouter({
  create: procedures.protected
    .input(answerCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");
      return ctx.db.insert(schema.answer).values({
        ...input,
        questionId: input.questionId,
        createdById: user.id,
      });
    }),

  update: procedures.protected
    .input(answerUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");
      return ctx.db
        .update(schema.answer)
        .set(input)
        .where(eq(schema.answer.id, input.id!))
        .returning();
    }),
});
