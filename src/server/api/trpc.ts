/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "@/server/db";
import { type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { type RespondentWithUserJwt } from "@/types/respondent";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */

export const createTRPCContext = async (opts: {
  headers: Headers;
  supabase: SupabaseClient;
}) => {
  const supabase = opts.supabase;

  const token = opts.headers.get("authorization");

  const respondentToken = cookies().get("respondent-identifier");
  let respondentUser = undefined;

  if (respondentToken) {
    try {
      const decoded = verify(respondentToken.value, `${process.env.JWT_HASH}`);
      respondentUser = (decoded as RespondentWithUserJwt).respondentUser;
    } catch (err) {}
  }

  const user = token
    ? await supabase.auth.getUser(token)
    : await supabase.auth.getUser();

  const source = opts.headers.get("x-trpc-source") ?? "unknown";
  console.log(">>> tRPC Request from", source, "by", user?.data.user?.email);

  return {
    user: user.data.user,
    db,
    respondentUser,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `user` as non-nullable
      user: ctx.user,
    },
  });
});
const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

const enforceUserHasJwt = t.middleware(async ({ ctx, next }) => {
  if (!ctx.respondentUser && !ctx.user?.id) {

    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      respondentUser: ctx.respondentUser,
      user: ctx.user,
    },
  });
});
const jwtProtectedProcedure = t.procedure.use(enforceUserHasJwt);

export const procedures = {
  public: publicProcedure,
  protected: protectedProcedure,
  jwtProtected: jwtProtectedProcedure,
};
