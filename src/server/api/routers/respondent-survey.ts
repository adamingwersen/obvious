import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { and, asc, eq, isNull, schema } from "@/server/db";
import {
  surveyRespondentInsertSchema,
  surveyRespondentSelectSchema,
  surveySelectSchema,
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

const surveyRespondentDeleteSchema = surveyRespondentSelectSchema.pick({
  surveyId: true,
  respondentUserId: true,
});

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
      return ctx.db.insert(schema.surveyToRespondentUser).values(data);
    }),

  // TODO: Maybe create a semi-public router? Don't know if that's a thing...
  // validate: procedures.public
  //   .input(respondentValidateSchema)
  //   .query(async ({ ctx, input }) => {
  //     const respondent = await ctx.db.query.respondent.findFirst({
  //       where: and(
  //         eq(schema.respondent.email, input.email),
  //         eq(schema.respondent.surveyId, input.surveyId),
  //       ),
  //     });
  //     if (!respondent) return null;
  //     return respondent;
  //   }),

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
