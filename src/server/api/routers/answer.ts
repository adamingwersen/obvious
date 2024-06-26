import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { and, eq, isNull, schema, inArray } from "@/server/db";
import { answerInsertSchema, answerSelectSchema } from "@/server/db/schema";
import { z } from "zod";

const answerCreateSchema = answerInsertSchema.pick({
  content: true,
  documentUrls: true,
  questionId: true,
});
const answerUpdateSchema = answerInsertSchema
  .pick({
    content: true,
    documentUrls: true,
    id: true,
  })
  .partial({ content: true }); // Make it possible to update without content

const findUserAnswersForQuestionsSchema = z.object({
  questionIds: z.array(z.number()),
});

const answerFindByIdSchema = answerSelectSchema.pick({
  id: true,
});

const deleteByQuestionIdSchema = answerSelectSchema.pick({
  questionId: true,
});

export const answerRouter = createTRPCRouter({
  findById: procedures.jwtProtected
    .input(answerFindByIdSchema)
    .query(async ({ ctx, input }) => {
      const answer = await ctx.db.query.answer.findFirst({
        where: eq(schema.answer.id, input.id),
      });
      if (!answer) throw new Error("No answer found");
      return answer;
    }),

  create: procedures.jwtProtected
    .input(answerCreateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.respondentUser)
        throw new Error("Cant create answer without respondent");
      const respondentUserId = ctx.respondentUser.respondentUserId;
      return ctx.db
        .insert(schema.answer)
        .values({
          ...input,
          questionId: input.questionId,
          createdById: respondentUserId,
        })
        .returning();
    }),

  update: procedures.jwtProtected
    .input(answerUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(schema.answer)
        .set(input)
        .where(eq(schema.answer.id, input.id!))
        .returning();
    }),

  findManyByQuestionIdsForUser: procedures.protected
    .input(findUserAnswersForQuestionsSchema)
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

  findManyByQuestionIdsForRespondent: procedures.jwtProtected
    .input(findUserAnswersForQuestionsSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.respondentUser) throw new Error("Missing respondent");
      const respondentUserId = ctx.respondentUser.respondentUserId;
      return ctx.db.query.answer.findMany({
        where: and(
          eq(schema.answer.createdById, respondentUserId),
          inArray(schema.answer.questionId, input.questionIds),
          isNull(schema.answer.deletedAt),
        ),
      });
    }),
  findManyByQuesitionIds: procedures.jwtProtected
    .input(findUserAnswersForQuestionsSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.respondentUser) throw new Error("Missing respondent");
      const respondentUserId = ctx.respondentUser.respondentUserId;
      return ctx.db.query.answer.findMany({
        where: and(
          eq(schema.answer.createdById, respondentUserId),
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
