"use server";

import { type CreateQuestionFormFields } from "@/components/forms/schemas/create-question";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";

export const handleUpsertQuestion = async (
  data: CreateQuestionFormFields,
  pathToRevalidate?: string,
) => {
  const surveyId = data.surveyId;
  if (!surveyId) throw new Error("No survey id provided to usert question");

  await api.question.upsert({ surveyId, ...data });
  if (pathToRevalidate) revalidatePath(pathToRevalidate, "page");
};

export const handleDeleteQuestion = async (
  questionId: number,
  pathToRevalidate?: string,
) => {
  await api.question.deleteById({ id: questionId });
  if (pathToRevalidate) revalidatePath(pathToRevalidate, "page");
};
