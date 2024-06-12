import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { and, eq, isNull, schema, inArray } from "@/server/db";
import { answerInsertSchema, answerSelectSchema } from "@/server/db/schema";
import { z } from "zod";

const answerCreateSchema = answerInsertSchema
  .pick({
    content: true,
    documentUrls: true,
    questionId: true,
  })
  .extend({
    respondentId: z.number().positive(),
  });
const answerUpdateSchema = answerInsertSchema
  .pick({
    content: true,
    documentUrls: true,
    id: true,
  })
  .partial({ content: true }); // Make it possible to update without content

const getRespondentAnswersForQuestionsSchema = z.object({
  questionIds: z.array(z.number()),
  respondentId: z.number().positive(),
});

const getUserAnswersForQuestionsSchema = z.object({
  questionIds: z.array(z.number()),
});

const answerFindByIdSchema = answerSelectSchema.pick({
  id: true,
});

const deleteByQuestionIdSchema = answerSelectSchema.pick({
  questionId: true,
});

export const answerRouter = createTRPCRouter({
  findById: procedures.protected
    .input(answerFindByIdSchema)
    .query(async ({ ctx, input }) => {
      const answer = await ctx.db.query.answer.findFirst({
        where: eq(schema.answer.id, input.id),
      });
      if (!answer) throw new Error("No answer found");
      return answer;
    }),

  create: procedures.public
    .input(answerCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(schema.answer)
        .values({
          ...input,
          questionId: input.questionId,
          createdById: input.respondentId,
        })
        .returning();
    }),

  update: procedures.protected
    .input(answerUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(schema.answer)
        .set(input)
        .where(eq(schema.answer.id, input.id!))
        .returning();
    }),

  findManyByQuestionIds: procedures.protected
    .input(getUserAnswersForQuestionsSchema)
    .mutation(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");
      return ctx.db.query.answer.findMany({
        where: and(
          eq(schema.answer.createdById, user.id),
          inArray(schema.answer.questionId, input.questionIds),
          isNull(schema.answer.deletedAt),
        ),
      });
    }),

  findManyByQuestionIdsForRespondent: procedures.public
    .input(getRespondentAnswersForQuestionsSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.query.answer.findMany({
        where: and(
          eq(schema.answer.createdById, input.respondentId),
          inArray(schema.answer.questionId, input.questionIds),
          isNull(schema.answer.deletedAt),
        ),
      });
    }),

  deleteByQuestionId: procedures.protected
    .input(deleteByQuestionIdSchema)
    .mutation(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");
      return ctx.db
        .delete(schema.answer)
        .where(eq(schema.answer.questionId, input.questionId));
    }),
});
