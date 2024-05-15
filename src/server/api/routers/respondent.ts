import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { and, eq, schema } from "@/server/db";
import {
  respondentInsertSchema,
  respondentSelectSchema,
} from "@/server/db/schema";
import { z } from "zod";

const respondentCreateSchema = respondentInsertSchema.pick({
  surveyId: true,
  email: true,
});

const respondentCreateManySchema = z.array(respondentCreateSchema);

const respondentValidateSchema = respondentSelectSchema.pick({
  email: true,
  surveyId: true,
});

const respondentUpdateFirstSeenAtSchema = respondentInsertSchema.pick({
  id: true,
  surveyId: true,
});

export const respondentRouter = createTRPCRouter({
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
            eq(input.id, schema.respondent.id),
          ),
        );
    }),
});
