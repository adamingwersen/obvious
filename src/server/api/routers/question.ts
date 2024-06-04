import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { eq, schema } from "@/server/db";
import { questionInsertSchema, questionSelectSchema } from "@/server/db/schema";

const questionCreateSchema = questionInsertSchema.pick({
  title: true,
  content: true,
  surveyId: true,
});

const questionUpdateSchema = questionInsertSchema
  .pick({
    title: true,
    content: true,
    id: true,
  })
  .partial({ content: true });

const questionDeleteByIdSchema = questionSelectSchema.pick({
  id: true,
});

const questionFindByIdSchema = questionSelectSchema.pick({
  id: true,
});

const findManyBySurveyIdSchema = questionSelectSchema.pick({
  surveyId: true,
});

export const questionRouter = createTRPCRouter({
  create: procedures.protected
    .input(questionCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");
      return ctx.db
        .insert(schema.question)
        .values({ ...input, createdById: user.id });
    }),

  update: procedures.protected
    .input(questionUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");
      const updatedQuestion = ctx.db
        .update(schema.question)
        .set(input)
        .where(eq(schema.question.id, input.id!))
        .returning();
      // If content is set we assume its new content
      // We remove previous translations for question
      if (input.content !== undefined) {
        await ctx.db
          .delete(schema.translation)
          .where(eq(schema.translation.questionId, input.id!));
      }
      return updatedQuestion;
    }),

  deleteById: procedures.protected
    .input(questionDeleteByIdSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(schema.question)
        .where(eq(schema.question.id, input.id));
    }),

  findById: procedures.protected
    .input(questionFindByIdSchema)
    .query(async ({ ctx, input }) => {
      const question = await ctx.db.query.question.findFirst({
        where: eq(schema.question.id, input.id),
      });
      if (!question) throw new Error("No questions found");
      return question;
    }),

  findManyBySurveyId: procedures.protected
    .input(findManyBySurveyIdSchema)
    .query(async ({ ctx, input }) => {
      const question = await ctx.db.query.question.findMany({
        where: eq(schema.question.surveyId, input.surveyId),
      });
      if (!question) throw new Error("No questions found");
      return question;
    }),
});
