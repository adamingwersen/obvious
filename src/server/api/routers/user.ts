import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { and, eq, inArray, isNull, schema } from "@/server/db";
import { userInsertSchema, userSelectSchema } from "@/server/db/schema";
import { z } from "zod";

const getByEmailSchema = userSelectSchema.pick({ email: true });
const updateSchema = userInsertSchema.pick({
  id: true,
  firstName: true,
  lastName: true,
  privilege: true,
  describedRole: true,
  organisationRole: true,
});

const findManyByIdSchema = z.array(userSelectSchema.pick({ id: true }));

const createByEmailSchema = userInsertSchema.pick({ email: true });

const createManyByEmailSchema = z.array(createByEmailSchema);

export const userRouter = createTRPCRouter({
  getByEmail: procedures.protected
    .input(getByEmailSchema)
    .query(({ ctx, input }) => {
      return ctx.db.query.user.findFirst({
        where: eq(schema.user.email, input.email),
      });
    }),
  findManyById: procedures.protected
    .input(findManyByIdSchema)
    .query(({ ctx, input }) => {
      const ids = input.map((x) => x.id);
      if (ids.length === 0) return [];
      return ctx.db.query.user.findMany({
        where: inArray(schema.user.id, ids),
      });
    }),

  update: procedures.protected
    .input(updateSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      if (!userId) throw new Error("User not logged in?");
      return await ctx.db
        .update(schema.user)
        .set(input)
        .where(eq(schema.user.authId, userId));
    }),

  getUserWithOrg: procedures.protected.query(async ({ ctx }) => {
    const user = await ctx.db.query.user.findFirst({
      where: eq(schema.user.authId, ctx.user.id),
      with: { organisation: true },
    });
    return user;
  }),

  create: procedures.protected
    .input(userInsertSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(schema.user)
        .values({ ...input })
        .returning({ newUserId: schema.user.id });
    }),

  createManyByEmail: procedures.protected
    .input(createManyByEmailSchema)
    .mutation(async ({ ctx, input }) => {
      const newUsers = await ctx.db
        .insert(schema.user)
        .values(input)
        .onConflictDoNothing({ target: schema.user.email })
        .returning();
      if (newUsers.length > 0) {
        return newUsers;
      } else {
        return await ctx.db.query.user.findMany({
          where: and(
            inArray(
              schema.user.email,
              input.map((x) => x.email),
            ),
            isNull(schema.user.deletedAt),
          ),
        });
      }
    }),
});
