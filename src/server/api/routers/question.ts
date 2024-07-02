import { questionUpsertSchema } from "@/components/forms/schemas/create-question";
import { keysFromObject } from "@/lib/utils";
import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { eq, schema, sql } from "@/server/db";
import { type QuestionModel, questionSelectSchema } from "@/server/db/schema";

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
  upsert: procedures.protected
    .input(questionUpsertSchema)
    .mutation(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });

      if (!user) throw new Error("No user found");
      const values = input.map((x) => {
        return { ...x, createdById: user.id };
      });

      if (values.length === 0 || !values[0]) return;

      return await ctx.db
        .insert(schema.question)
        .values(values)
        .onConflictDoUpdate({
          target: schema.question.id,
          set: Object.assign(
            {},
            ...keysFromObject(values[0])
              .filter((k) => k !== "id")
              .map((k) => ({ [k]: sql`excluded.${k}` })),
          ) as Partial<QuestionModel>,
        });
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
