import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { schema } from "@/server/db";
import {
  conflictUpdateSetAllColumns,
  metadataAnswerInsertSchema,
} from "@/server/db/schema";
import { z } from "zod";

const metadataAnswerCreateSchema = metadataAnswerInsertSchema.pick({
  id: true,
  surveyId: true,
  metadataQuestionId: true,
  createdById: true,
  response: true,
});

const metadataAnswerCreateManySchema = z.array(metadataAnswerCreateSchema);

export const metadataAnswerRouter = createTRPCRouter({
  create: procedures.jwtProtected
    .input(metadataAnswerCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const respondent = ctx.respondentUser;
      if (!respondent) throw new Error("Respondent not found");
      return ctx.db.insert(schema.metadataAnswer).values({ ...input });
    }),

  createMany: procedures.jwtProtected
    .input(metadataAnswerCreateManySchema)
    .mutation(async ({ ctx, input }) => {
      if (input.length === 0) throw new Error("No answers in input");
      const isCreatedByIdsEqual = input.every(
        (val, i, arr) => val.createdById === arr[0]?.createdById,
      );
      if (!isCreatedByIdsEqual)
        throw new Error("Multiple respondent IDs in input");
      return ctx.db
        .insert(schema.metadataAnswer)
        .values(input)
        .onConflictDoUpdate({
          target: schema.metadataAnswer.id,
          set: conflictUpdateSetAllColumns(schema.metadataAnswer),
        });
    }),
});
