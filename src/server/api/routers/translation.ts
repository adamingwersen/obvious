import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { and, eq, schema, inArray } from "@/server/db";
import { translationInsertSchema } from "@/server/db/schema/translation.schema";
import { z } from "zod";

const translationCreateSchema = translationInsertSchema
  .pick({
    translatedContent: true,
    language: true,
    questionId: true,
    answerId: true,
  })
  .partial({
    questionId: true,
    answerId: true,
  });

const translationFindByAnswerIdSchema = z.object({
  answerId: z.number(),
});

const translationFindByQuestionIdSchema = z.object({
  questionId: z.number(),
});

const translationFindManyByQuestionIdSchema = z.object({
  questionIds: z.array(z.number()),
});

export const translationRouter = createTRPCRouter({
  findByAnswerId: procedures.protected
    .input(translationFindByAnswerIdSchema)
    .query(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");
      const translations = await ctx.db.query.translation.findMany({
        where: and(
          eq(schema.translation.answerId, input.answerId),
          eq(schema.translation.createdById, user.id),
        ),
      });
      return translations;
    }),

  findByQuestionId: procedures.protected
    .input(translationFindByQuestionIdSchema)
    .query(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");
      const translations = await ctx.db.query.translation.findMany({
        where: and(
          eq(schema.translation.questionId, input.questionId),
          eq(schema.translation.createdById, user.id),
        ),
      });
      return translations;
    }),

  findManyByQuestionIds: procedures.protected
    .input(translationFindManyByQuestionIdSchema)
    .query(async ({ ctx, input }) => {
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");
      const translations = await ctx.db.query.translation.findMany({
        where: and(
          inArray(schema.translation.questionId, input.questionIds),
          eq(schema.translation.createdById, user.id),
        ),
      });
      return translations;
    }),

  create: procedures.protected
    .input(translationCreateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!!input.answerId === !!input.questionId) {
        throw new Error(
          "One and only one of answerId or questionId should have a value",
        );
      }
      const authUserId = ctx.user.id;
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.authId, authUserId),
      });
      if (!user) throw new Error("No user found");
      return ctx.db
        .insert(schema.translation)
        .values({
          ...input,
          createdById: user.id,
        })
        .returning();
    }),
});
