import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { and, eq, isNull, schema, inArray } from "@/server/db";
import { answerInsertSchema, answerSelectSchema } from "@/server/db/schema";
import { z } from "zod";
import { sql } from "drizzle-orm";

const answerCreateSchema = answerInsertSchema.pick({
  content: true,
  documentUrls: true,
  questionId: true,
});
const answerUpdateSchema = answerInsertSchema.partial({
  content: true,
  createdById: true,
  questionId: true,
});

const findUserAnswersForQuestionsSchema = z.object({
  questionIds: z.array(z.number()),
});

const answerFindByIdSchema = answerSelectSchema.pick({
  id: true,
});

const deleteByQuestionIdSchema = answerSelectSchema.pick({
  questionId: true,
});

const addFilePathToAnswerSchema = answerSelectSchema
  .pick({ id: true })
  .extend({ newPath: z.string() });

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

  findManyByQuestionIdsForRespondent: procedures.jwtProtected
    .input(findUserAnswersForQuestionsSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.respondentUser)
        throw new Error("Need respondent session to get answers");
      const respondentUserId = ctx.respondentUser.respondentUserId;
      return ctx.db.query.answer.findMany({
        where: and(
          eq(schema.answer.createdById, respondentUserId),
          inArray(schema.answer.questionId, input.questionIds),
          isNull(schema.answer.deletedAt),
        ),
      });
    }),

  findManyForSurveys: procedures.protected
    .input(z.array(z.number().nonnegative()))
    .query(async ({ ctx, input }) => {
      const questionsForSurveys = await ctx.db.query.question.findMany({
        where: inArray(schema.question.surveyId, input),
      });
      const qIds = questionsForSurveys.map((x) => x.id);

      const surveyIdLookup = questionsForSurveys.reduce(
        (acc, x) => {
          acc[x.id] = x.surveyId;
          return acc;
        },
        {} as Record<number, number>,
      );
      const answers = await ctx.db.query.answer.findMany({
        where: inArray(schema.answer.questionId, qIds),
      });
      const answersWithSurveyIds = answers.map((a) => {
        return { ...a, surveyId: surveyIdLookup[a.questionId] };
      });
      return answersWithSurveyIds;
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

  addFilePath: procedures.protected
    .input(addFilePathToAnswerSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.execute(
        sql`
        UPDATE answer SET 
        document_urls = array_append(document_urls, ${input.newPath}) 
        WHERE ${schema.answer.id} = ${input.id} 
        `,
      );
    }),
});
