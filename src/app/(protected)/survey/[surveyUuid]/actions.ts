"use server";

import { api } from "@/trpc/server";
import { type CreateQuestionFormFields } from "./_components/CreateQuestion";
import { revalidatePath } from "next/cache";

export const handleUpsertQuestionFormSubmit = async (
  data: CreateQuestionFormFields,
  surveyId: number,
  questionId?: number,
) => {
  if (!questionId) await api.question.create({ ...data, surveyId });
  if (questionId) await api.question.update({ ...data, id: questionId });

  revalidatePath(`/(protected)/survey/[surveyUuid]/configure`, "page");
};

export const handleRemoveQuestion = async (questionId: number) => {
  await api.question.deleteById({ id: questionId });
  revalidatePath(`/(protected)/survey/[surveyUuid]/configure`, "page");

  // TODO: Add Toaster here
};
