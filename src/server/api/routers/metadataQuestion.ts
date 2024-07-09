import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { asc, sql } from "drizzle-orm";
import { eq, inArray, schema } from "@/server/db";
import {
  metadataQuestionInsertSchema,
  metadataQuestionSelectSchema,
} from "@/server/db/schema";
import { z } from "zod";

const metadataQuestionCreateSchema = metadataQuestionInsertSchema.pick({
  id: true,
  title: true,
  metadataType: true,
  surveyId: true,
});

const metadataQuestionCreateManySchema = z.array(metadataQuestionCreateSchema);

const metadataQuestionDeleteSchema = metadataQuestionSelectSchema.pick({
  id: true,
});

const findManyBySurveyUuidSchema = z.object({ surveyUuid: z.string() });
const findManyBySurveyIdSchema = z.object({ surveyId: z.number() });

export const metadataQuestionRouter = createTRPCRouter({
  create: procedures.protected
    .input(metadataQuestionCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");
      return ctx.db.insert(schema.metadataQuestion).values({
        ...input,
        createdById: user.id,
      });
    }),

  createMany: procedures.protected
    .input(metadataQuestionCreateManySchema)
    .mutation(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");
      const data = input.map((x) => {
        return { ...x, createdById: user.id };
      });
      if (data.length === 0 || data[0] === undefined) {
        throw new Error("No data found for survey metadata creation");
      }
      // Fetch current survey metadata fields
      const currentFields = await ctx.db.query.metadataQuestion.findMany({
        where: eq(schema.metadataQuestion.surveyId, data[0].surveyId),
      });

      // Upsert new survey metadata fields
      const newFieldIds = await ctx.db
        .insert(schema.metadataQuestion)
        .values(data)
        .onConflictDoUpdate({
          target: schema.metadataQuestion.id,
          set: {
            title: sql.raw(`excluded.${schema.metadataQuestion.title.name}`),
            metadataType: sql.raw(
              `excluded.${schema.metadataQuestion.metadataType.name}`,
            ),
          },
        })
        .returning({ id: schema.metadataQuestion.id });

      // Delete fields that are not in the new set
      const toDelete = currentFields
        .filter((x) => !newFieldIds.some((y) => y.id === x.id))
        .map((x) => x.id);
      if (toDelete.length > 0) {
        await ctx.db
          .delete(schema.metadataQuestion)
          .where(inArray(schema.metadataQuestion.id, toDelete));
      }
    }),

  deleteById: procedures.protected
    .input(metadataQuestionDeleteSchema)
    .query(async ({ ctx, input }) => {
      const metadataQuestion = await ctx.db.query.metadataQuestion.findFirst({
        where: eq(schema.metadataQuestion.id, input.id),
      });
      if (!metadataQuestion) throw new Error("No survey metadata found");
      return metadataQuestion;
    }),

  findManyBySurveyUuid: procedures.protected
    .input(findManyBySurveyUuidSchema)
    .query(async ({ ctx, input }) => {
      const survey = await ctx.db.query.survey.findFirst({
        where: eq(schema.survey.uuid, input.surveyUuid),
      });
      if (!survey) throw new Error("No survey found");
      const metadataQuestions = await ctx.db.query.metadataQuestion.findMany({
        where: eq(schema.metadataQuestion.surveyId, survey.id),
        orderBy: asc(schema.metadataQuestion.id),
      });
      if (!metadataQuestions) return [];
      return metadataQuestions;
    }),

  findManyBySurveyId: procedures.jwtProtected
    .input(findManyBySurveyIdSchema)
    .query(async ({ ctx, input }) => {
      const metadataQuestions = await ctx.db.query.metadataQuestion.findMany({
        with: { metadataAnswer: true },
        where: eq(schema.metadataQuestion.surveyId, input.surveyId),
        orderBy: asc(schema.metadataQuestion.id),
      });
      if (!metadataQuestions) return [];
      return metadataQuestions;
    }),
});
