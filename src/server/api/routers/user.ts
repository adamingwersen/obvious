import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { eq, inArray, schema } from "@/server/db";
import { userInsertSchema, userSelectSchema } from "@/server/db/schema";
import { z } from "zod";

const getByEmailSchema = userSelectSchema.pick({ email: true });
const updateSchema = userInsertSchema
  .partial({ authId: true, firstName: true, lastName: true, privilege: true })
  .required({ email: true });
const updatePrivilegeSchema = userSelectSchema.pick({
  id: true,
  privilege: true,
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
      return ctx.db.query.user.findMany({
        where: inArray(schema.user.id, ids),
      });
    }),

  updateByEmail: procedures.protected
    .input(updateSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(schema.user)
        .set({
          authId: input.authId,
          firstName: input.firstName,
          lastName: input.lastName,
          privilege: input.privilege,
        })
        .where(eq(schema.user.email, input.email))
        .returning();
    }),
  updatePrivilege: procedures.protected
    .input(updatePrivilegeSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(schema.user)
        .set({ privilege: input.privilege })
        .where(eq(schema.user.id, input.id));
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
      return ctx.db.insert(schema.user).values(input).returning();
    }),
});
