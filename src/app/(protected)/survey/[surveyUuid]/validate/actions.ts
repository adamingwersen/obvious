"use server";

import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";

export const handleDeleteQuestionById = async (
  questionId: number,
  allowAnswerCascading: boolean,
) => {
  if (allowAnswerCascading) {
    await api.answer.deleteByQuestionId({ questionId: questionId });
  }
  await api.question.deleteById({ id: questionId });
  revalidatePath(`/(protected)/survey/[surveyUuid]/validate`, "page");
};
