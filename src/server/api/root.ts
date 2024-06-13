import { answerRouter } from "@/server/api/routers/answer";
import { questionRouter } from "@/server/api/routers/question";
import { surveyRouter } from "@/server/api/routers/survey";
import { surveyInstanceRouter } from "@/server/api/routers/surveyInstance";
import { metadataQuestionRouter } from "@/server/api/routers/metadataQuestion";
import { userRouter } from "@/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { respondentRouter } from "@/server/api/routers/respondent";
import { metadataAnswerRouter } from "@/server/api/routers/metadataAnswer";
import { translationRouter } from "@/server/api/routers/translation";
import { organisationRouter } from "./routers/organisation";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  survey: surveyRouter,
  surveyInstance: surveyInstanceRouter,
  answer: answerRouter,
  question: questionRouter,
  metadataQuestion: metadataQuestionRouter,
  metadataAnswer: metadataAnswerRouter,
  respondent: respondentRouter,
  translation: translationRouter,
  organisation: organisationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
