"use server";

import { type CreateQuestionFormFields } from "@/components/forms/schemas/create-question";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";

export const handleUpsertQuestion = async (
  data: CreateQuestionFormFields,
  surveyId: number,
  questionId?: number,
) => {
  if (!questionId) await api.question.create({ ...data, surveyId });
  if (questionId) await api.question.update({ ...data, id: questionId });

  revalidatePath(`/(protected)/survey/[surveyUuid]/create`, "page");
};

export const handleDeleteQuestion = async (questionId: number) => {
  await api.question.deleteById({ id: questionId });
  revalidatePath(`/(protected)/survey/[surveyUuid]/create`, "page");

  // TODO: Add Toaster here
};
