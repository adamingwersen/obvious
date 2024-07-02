"use server";

// import { type CreateQuestionFormFields } from "@/components/forms/schemas/create-question";
import { type QuestionModel } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";

export const handleUpsertQuestions = async (
  questions: QuestionModel[],
  pathToRevalidate?: string,
) => {
  // if (!surveyId) throw new Error("No survey id provided to usert question");
  await api.question.upsert(questions);
  if (pathToRevalidate) revalidatePath(pathToRevalidate, "page");
};

export const handleDeleteQuestion = async (
  questionId: number,
  allowAnswerCascading: boolean,
  pathToRevalidate?: string,
) => {
  if (allowAnswerCascading) {
    await api.answer.deleteByQuestionId({ questionId: questionId });
  }
  await api.question.deleteById({ id: questionId });
  if (pathToRevalidate) revalidatePath(pathToRevalidate, "page");
};
