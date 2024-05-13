import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { asc, sql } from "drizzle-orm";
import { eq, inArray, schema } from "@/server/db";
import {
  surveyMetadataInsertSchema,
  surveyMetadataSelectSchema,
} from "@/server/db/schema";
import { z } from "zod";

const surveyMetadataCreateSchema = surveyMetadataInsertSchema.pick({
  id: true,
  title: true,
  metadataType: true,
  surveyId: true,
});

const surveyMetadataCreateManySchema = z.array(surveyMetadataCreateSchema);

const surveyMetadataDeleteSchema = surveyMetadataSelectSchema.pick({
  id: true,
});

const findManyBySurveyUuidSchema = z.object({ surveyUuid: z.string() });

export const surveyMetadataRouter = createTRPCRouter({
  create: procedures.protected
    .input(surveyMetadataCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");
      return ctx.db.insert(schema.surveyMetadata).values({
        ...input,
        createdById: user.id,
      });
    }),

  createMany: procedures.protected
    .input(surveyMetadataCreateManySchema)
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
      const currentFields = await ctx.db.query.surveyMetadata.findMany({
        where: eq(schema.surveyMetadata.surveyId, data[0].surveyId),
      });

      // Upsert new survey metadata fields
      const newFieldIds = await ctx.db
        .insert(schema.surveyMetadata)
        .values(data)
        .onConflictDoUpdate({
          target: schema.surveyMetadata.id,
          set: {
            title: sql.raw(`excluded.${schema.surveyMetadata.title.name}`),
          },
        })
        .returning({ id: schema.surveyMetadata.id });

      // Delete fields that are not in the new set
      const toDelete = currentFields
        .filter((x) => !newFieldIds.some((y) => y.id === x.id))
        .map((x) => x.id);
      if (toDelete.length > 0) {
        await ctx.db
          .delete(schema.surveyMetadata)
          .where(inArray(schema.surveyMetadata.id, toDelete));
      }
    }),

  deleteById: procedures.protected
    .input(surveyMetadataDeleteSchema)
    .query(async ({ ctx, input }) => {
      const surveyMetadata = await ctx.db.query.surveyMetadata.findFirst({
        where: eq(schema.surveyMetadata.id, input.id),
      });
      if (!surveyMetadata) throw new Error("No survey metadata found");
      return surveyMetadata;
    }),

  findManyBySurveyUuid: procedures.protected
    .input(findManyBySurveyUuidSchema)
    .query(async ({ ctx, input }) => {
      const survey = await ctx.db.query.survey.findFirst({
        where: eq(schema.survey.uuid, input.surveyUuid),
      });
      if (!survey) throw new Error("No survey found");
      const surveyMetadatas = await ctx.db.query.surveyMetadata.findMany({
        where: eq(schema.surveyMetadata.surveyId, survey.id),
        orderBy: asc(schema.surveyMetadata.createdAt),
      });
      if (!surveyMetadatas) return [];
      return surveyMetadatas;
    }),
});
