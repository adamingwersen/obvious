import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { eq, schema } from "@/server/db";
import { surveySelectSchema } from "@/server/db/schema";

const surveyCreateSchema = surveySelectSchema.pick({
  title: true,
});
const surveyFindByIdSchema = surveySelectSchema.pick({
  uuid: true,
});

export const surveyRouter = createTRPCRouter({
  create: procedures.protected
    .input(surveyCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");

      const newSurveys = await ctx.db
        .insert(schema.survey)
        .values({
          title: input.title,
          createdById: user?.id,
        })
        .returning();
      if (!newSurveys || newSurveys.length === 0)
        throw new Error("Error creating new survey");

      const newSurvey = newSurveys[0];
      if (!newSurvey) throw new Error("Error creating new survey");
      return newSurvey;
    }),

  findAllByCurrentUser: procedures.protected.query(async ({ ctx }) => {
    const authUserId = ctx.user.id;
    const user = await ctx.db.query.user.findFirst({
      where: eq(schema.user.authId, authUserId),
    });
    if (!user) throw new Error("No user found");

    return ctx.db.query.survey.findMany({
      where: eq(schema.survey.createdById, user.id),
    });
  }),

  findById: procedures.protected
    .input(surveyFindByIdSchema)
    .query(async ({ ctx, input }) => {
      const survey = await ctx.db.query.survey.findFirst({
        where: eq(schema.survey.uuid, input.uuid),
        with: { questions: true },
      });
      if (!survey) throw new Error("No survey found");
      return survey;
    }),
});
