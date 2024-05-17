import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { asc, sql } from "drizzle-orm";
import { eq, inArray, schema } from "@/server/db";
import { metadataAnswerInsertSchema } from "@/server/db/schema";
import { z } from "zod";

const metadataAnswerCreateSchema = metadataAnswerInsertSchema.pick({
  surveyId: true,
  metadataQuestionId: true,
  createdById: true,
  response: true,
  metadataType: true,
});

const metadataAnswerCreateManySchema = z.array(metadataAnswerCreateSchema);

export const metadataAnswerRouter = createTRPCRouter({
  create: procedures.public
    .input(metadataAnswerCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const respondent = await ctx.db.query.respondent.findFirst({
        where: eq(schema.respondent.id, input.createdById),
      });
      if (!respondent) throw new Error("Respondent not found");
      return ctx.db.insert(schema.metadataAnswer).values({ ...input });
    }),

  createMany: procedures.public
    .input(metadataAnswerCreateManySchema)
    .mutation(async ({ ctx, input }) => {
      if (input.length === 0) throw new Error("No answers in input");
      const isCreatedByIdsEqual = input.every(
        (val, i, arr) => val.createdById === arr[0]?.createdById,
      );
      if (!isCreatedByIdsEqual)
        throw new Error("Multiple respondent IDs in input");

      console.log({ input });
      return ctx.db.insert(schema.metadataAnswer).values(input);
    }),
});
