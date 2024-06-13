import { createTRPCRouter, procedures } from "@/server/api/trpc";
import { eq, schema } from "@/server/db";
import { organisationSelectSchema } from "@/server/db/schema";

const findAllSchema = organisationSelectSchema.pick({});

export const organisationRouter = createTRPCRouter({
  findAll: procedures.protected.input(findAllSchema).query(({ ctx, input }) => {
    return ctx.db.query.organisation.findMany({});
  }),
});