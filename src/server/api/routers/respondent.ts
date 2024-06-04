import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { and, asc, eq, isNull, schema } from "@/server/db";
import {
  respondentInsertSchema,
  respondentSelectSchema,
  surveySelectSchema,
} from "@/server/db/schema";
import { z } from "zod";

const respondentCreateSchema = respondentInsertSchema.pick({
  surveyId: true,
  email: true,
});

const respondentFindByUuuidSchema = respondentSelectSchema.pick({
  uuid: true,
});

const respondentCreateManySchema = z.array(respondentCreateSchema);

const respondentValidateSchema = respondentSelectSchema.pick({
  email: true,
  surveyId: true,
});

const respondentUpdateFirstSeenAtSchema = respondentInsertSchema
  .pick({
    id: true,
    surveyId: true,
  })
  .required({ id: true });

const respondentFindBySurveyUuidSchema = surveySelectSchema.pick({
  uuid: true,
});

export const respondentRouter = createTRPCRouter({
  delete: procedures.protected
    .input(respondentValidateSchema)
    .mutation(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");
      const survey = await ctx.db.query.survey.findFirst({
        where: eq(schema.survey.id, input.surveyId),
      });
      if (!survey) throw new Error("No survey found");
      return ctx.db
        .delete(schema.respondent)
        .where(
          and(
            eq(schema.respondent.email, input.email),
            eq(schema.respondent.surveyId, survey.id),
          ),
        );
    }),

  create: procedures.protected
    .input(respondentCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");
      const survey = await ctx.db.query.survey.findFirst({
        where: eq(schema.survey.id, input.surveyId),
      });
      if (!survey) throw new Error("No survey found");

      return ctx.db
        .insert(schema.respondent)
        .values({ ...input, invitedById: user.id });
    }),
  createMany: procedures.protected
    .input(respondentCreateManySchema)
    .mutation(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");
      if (input.length === 0) throw new Error("No respondents in input");
      const isSurveyIdsEqual = input.every(
        (val, i, arr) => val.surveyId === arr[0]?.surveyId,
      );
      if (!isSurveyIdsEqual) throw new Error("Multiple survey IDs in input");

      const data = input.map((respondent) => {
        return {
          surveyId: respondent.surveyId,
          email: respondent.email,
          invitedById: user.id,
        };
      });
      return ctx.db.insert(schema.respondent).values(data);
    }),

  // TODO: Maybe create a semi-public router? Don't know if that's a thing...
  validate: procedures.public
    .input(respondentValidateSchema)
    .query(async ({ ctx, input }) => {
      const respondent = await ctx.db.query.respondent.findFirst({
        where: and(
          eq(schema.respondent.email, input.email),
          eq(schema.respondent.surveyId, input.surveyId),
        ),
      });
      if (!respondent) return null;
      return respondent;
    }),

  updateFirstSeenAt: procedures.public
    .input(respondentUpdateFirstSeenAtSchema)
    .mutation(async ({ ctx, input }) => {
      const respondent = await ctx.db.query.respondent.findFirst({
        where: and(
          eq(schema.respondent.id, input.id),
          eq(schema.respondent.surveyId, input.surveyId),
        ),
      });
      if (!respondent) throw new Error("Respondent not found for this survey");
      return ctx.db
        .update(schema.respondent)
        .set({ firstSeenAt: new Date() })
        .where(
          and(
            eq(schema.respondent.surveyId, input.surveyId),
            eq(schema.respondent.id, input.id),
          ),
        );
    }),

  findBySurveyUuid: procedures.protected
    .input(respondentFindBySurveyUuidSchema)
    .query(async ({ ctx, input }) => {
      const survey = await ctx.db.query.survey.findFirst({
        where: and(
          eq(schema.survey.uuid, input.uuid),
          isNull(schema.survey.deletedAt),
        ),
      });
      if (!survey) throw new Error("No survey found");
      const respondents = await ctx.db.query.respondent.findMany({
        where: eq(schema.respondent.surveyId, survey.id),
        orderBy: [asc(schema.respondent.createdAt)],
      });
      if (!respondents) throw new Error("No respondents found for survey");
      return respondents;
    }),

  findByUuid: procedures.public
    .input(respondentFindByUuuidSchema)
    .query(async ({ ctx, input }) => {
      const respondent = await ctx.db.query.respondent.findFirst({
        where: and(eq(schema.respondent.uuid, input.uuid)),
      });
      if (!respondent) return null;
      return respondent;
    }),
});
