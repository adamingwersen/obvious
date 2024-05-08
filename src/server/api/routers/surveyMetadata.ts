import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { eq, schema } from "@/server/db";
import {
  surveyMetadataInsertSchema,
  surveyMetadataSelectSchema,
} from "@/server/db/schema";

const surveyMetadataCreateSchema = surveyMetadataInsertSchema.pick({
  title: true,
  description: true,
  metadataType: true,
  surveyId: true,
});

const surveyMetadataDeleteSchema = surveyMetadataSelectSchema.pick({
  id: true,
});

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
  deleteById: procedures.protected
    .input(surveyMetadataDeleteSchema)
    .query(async ({ ctx, input }) => {
      const surveyMetadata = await ctx.db.query.surveyMetadata.findFirst({
        where: eq(schema.surveyMetadata.id, input.id),
      });
      if (!surveyMetadata) throw new Error("No survey metadata found");
      return surveyMetadata;
    }),
});
