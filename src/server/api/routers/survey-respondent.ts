import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { and, eq, schema } from "@/server/db";
import {
  surveyRespondentInsertSchema,
  surveyRespondentSelectSchema,
} from "@/server/db/schema";
import { z } from "zod";

const surveyRespondentCreateSchema = surveyRespondentInsertSchema.pick({
  surveyId: true,
  respondentUserId: true,
});

const surveyRespondentUpsertAccessTokenSchema =
  surveyRespondentInsertSchema.pick({
    surveyId: true,
    respondentUserId: true,
    surveyAccessToken: true,
  });

const surveyRespondentCreateManySchema = z.array(surveyRespondentCreateSchema);

const surveyRespondentValidateSchema = surveyRespondentInsertSchema
  .pick({
    surveyId: true,
  })
  .extend({ email: z.string().email() });

const surveyRespondentDeleteSchema = surveyRespondentSelectSchema.pick({
  surveyId: true,
  respondentUserId: true,
});

const surveyRespondentFindByAccessTokenSchema = surveyRespondentSelectSchema
  .pick({
    surveyAccessToken: true,
  })
  .extend({ surveyUuid: z.string().uuid() });

export const surveyRespondentRouter = createTRPCRouter({
  delete: procedures.protected
    .input(surveyRespondentDeleteSchema)
    .mutation(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");

      return ctx.db
        .update(schema.surveyToRespondentUser)
        .set({ deletedAt: new Date() })
        .where(
          and(
            eq(schema.surveyToRespondentUser.surveyId, input.surveyId),
            eq(
              schema.surveyToRespondentUser.respondentUserId,
              input.respondentUserId,
            ),
          ),
        );
    }),

  create: procedures.protected
    .input(surveyRespondentCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");

      return ctx.db
        .insert(schema.surveyToRespondentUser)
        .values({ ...input, invitedById: user.id });
    }),

  createMany: procedures.protected
    .input(surveyRespondentCreateManySchema)
    .mutation(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");
      if (input.length === 0) throw new Error("No respondents in input");

      const data = input.map((respondent) => {
        return {
          surveyId: respondent.surveyId,
          respondentUserId: respondent.respondentUserId,
          invitedById: user.id,
        };
      });
      return ctx.db
        .insert(schema.surveyToRespondentUser)
        .values(data)
        .onConflictDoUpdate({
          target: [
            schema.surveyToRespondentUser.surveyId,
            schema.surveyToRespondentUser.respondentUserId,
          ],
          set: { deletedAt: null },
        })
        .returning();
    }),

  findByAccessTokenAndSurveyUuid: procedures.public
    .input(surveyRespondentFindByAccessTokenSchema)
    .query(async ({ ctx, input }) => {
      if (!input.surveyUuid) throw new Error("No surveyUuid provided");
      const survey = await ctx.db.query.survey.findFirst({
        where: eq(schema.survey.uuid, input.surveyUuid),
      });
      if (!survey) throw new Error("No survey with that uuid");
      if (!input.surveyAccessToken) throw new Error("No access token provided");
      return await ctx.db.query.surveyToRespondentUser.findFirst({
        where: and(
          eq(
            schema.surveyToRespondentUser.surveyAccessToken,
            input.surveyAccessToken,
          ),
          eq(schema.surveyToRespondentUser.surveyId, survey.id),
        ),
        with: { respondent: true },
      });
    }),

  validate: procedures.public
    .input(surveyRespondentValidateSchema)
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.email, input.email),
      });
      if (!user) throw new Error("User does not exist");
      const respondentSurvey =
        await ctx.db.query.surveyToRespondentUser.findFirst({
          where: and(
            eq(schema.surveyToRespondentUser.respondentUserId, user.id),
            eq(schema.surveyToRespondentUser.surveyId, input.surveyId),
          ),
        });
      if (!respondentSurvey)
        throw new Error("Respondent not valid for this survey");
      return respondentSurvey;
    }),

  updateFirstSeenAt: procedures.public
    .input(surveyRespondentCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(schema.surveyToRespondentUser)
        .set({ respondentFirstSeenAt: new Date() })
        .where(
          and(
            eq(schema.surveyToRespondentUser.surveyId, input.surveyId),
            eq(
              schema.surveyToRespondentUser.respondentUserId,
              input.respondentUserId,
            ),
          ),
        );
    }),

  upsertAccessToken: procedures.public
    .input(surveyRespondentUpsertAccessTokenSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(schema.surveyToRespondentUser)
        .set({ surveyAccessToken: input.surveyAccessToken })
        .where(
          and(
            eq(schema.surveyToRespondentUser.surveyId, input.surveyId),
            eq(
              schema.surveyToRespondentUser.respondentUserId,
              input.respondentUserId,
            ),
          ),
        );
    }),
});
