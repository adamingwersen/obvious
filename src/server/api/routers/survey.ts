import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { and, eq, isNull, schema } from "@/server/db";
import { surveySelectSchema } from "@/server/db/schema";

const surveyCreateSchema = surveySelectSchema.pick({
  title: true,
  description: true,
  dueAt: true,
});
const surveyFindByUuidSchema = surveySelectSchema.pick({
  uuid: true,
});
const surveyFindByIdSchema = surveySelectSchema.pick({
  id: true,
});

const surveyArchiveByIdSchema = surveySelectSchema.pick({
  id: true,
});

const updateSurveyNameSchema = surveySelectSchema.pick({
  id: true,
  title: true,
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
          description: input.description,
          dueAt: input?.dueAt,
        })
        .returning();
      if (!newSurveys || newSurveys.length === 0)
        throw new Error("Error creating new survey");

      const newSurvey = newSurveys[0];
      if (!newSurvey) throw new Error("Error creating new survey");
      return newSurvey;
    }),

  updateSurvey: procedures.protected
    .input(updateSurveyNameSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(schema.survey)
        .set(input)
        .where(eq(schema.survey.id, input.id));
    }),

  findAllByCurrentUser: procedures.protected.query(async ({ ctx }) => {
    const authUserId = ctx.user.id;
    const user = await ctx.db.query.user.findFirst({
      where: eq(schema.user.authId, authUserId),
    });
    if (!user) throw new Error("No user found");

    return ctx.db.query.survey.findMany({
      where: and(
        eq(schema.survey.createdById, user.id),
        isNull(schema.survey.deletedAt),
      ),
    });
  }),

  findAllByCurrentUserWithRelations: procedures.protected.query(
    async ({ ctx }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");

      return ctx.db.query.survey.findMany({
        where: and(
          eq(schema.survey.createdById, user.id),
          isNull(schema.survey.deletedAt),
        ),
        with: { questions: true, user: true },
      });
    },
  ),

  findByUuidWithRespondents: procedures.protected
    .input(surveyFindByUuidSchema)
    .query(async ({ ctx, input }) => {
      const survey = await ctx.db.query.survey.findFirst({
        where: and(
          eq(schema.survey.uuid, input.uuid),
          isNull(schema.survey.deletedAt),
        ),
        with: {
          questions: true,
          user: true,
          respondents: true,
        },
      });
      if (!survey) throw new Error("No survey found");
      survey.respondents = survey.respondents.filter(
        (x) => x.deletedAt === null,
      );
      return survey;
    }),

  findByUuid: procedures.jwtProtected
    .input(surveyFindByUuidSchema)
    .query(async ({ ctx, input }) => {
      const survey = await ctx.db.query.survey.findFirst({
        where: and(
          eq(schema.survey.uuid, input.uuid),
          isNull(schema.survey.deletedAt),
        ),
        with: {
          questions: true,
          user: true,
        },
      });
      if (!survey) throw new Error("No survey found");
      return survey;
    }),

  findById: procedures.jwtProtected
    .input(surveyFindByIdSchema)
    .query(async ({ ctx, input }) => {
      const survey = await ctx.db.query.survey.findFirst({
        where: and(
          eq(schema.survey.id, input.id),
          isNull(schema.survey.deletedAt),
        ),
        with: {
          questions: true,
          user: true,
        },
      });
      if (!survey) throw new Error("No survey found");
      return survey;
    }),

  findByUuidFull: procedures.protected
    .input(surveyFindByUuidSchema)
    .query(async ({ ctx, input }) => {
      const survey = await ctx.db.query.survey.findFirst({
        where: and(
          eq(schema.survey.uuid, input.uuid),
          isNull(schema.survey.deletedAt),
        ),
        with: {
          questions: {
            with: {
              answers: true,
            },
          },
          user: true,
          respondents: true,
        },
      });
      if (!survey) throw new Error("No survey found");
      return survey;
    }),

  // update on deleted_at
  archiveById: procedures.protected
    .input(surveyArchiveByIdSchema)
    .mutation(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");
      const targetSurvey = await ctx.db.query.survey.findFirst({
        where: eq(schema.survey.id, input.id),
      });
      if (targetSurvey?.createdById !== user.id)
        throw new Error("Not posssible to archive a survey you did not create");
      return ctx.db
        .update(schema.survey)
        .set({ deletedAt: new Date(), surveyStatus: "ARCHIVED" })
        .where(eq(schema.survey.id, input.id));
    }),
});
