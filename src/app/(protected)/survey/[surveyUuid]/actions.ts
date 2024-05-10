"use server";

import { api } from "@/trpc/server";
import { type CreateQuestionFormFields } from "./_components/CreateQuestion";
import { revalidatePath } from "next/cache";
import { type CreateAnswerFormFields } from "./_components/AnswerStepper";

export const handleUpsertQuestionFormSubmit = async (
  data: CreateQuestionFormFields,
  surveyId: number,
  questionId?: number,
) => {
  if (!questionId) await api.question.create({ ...data, surveyId });
  if (questionId) await api.question.update({ ...data, id: questionId });

  revalidatePath(`/(protected)/survey/[surveyUuid]/configure`, "page");
};

export const handleUpserAnswerFormSubmit = async (
  data: CreateAnswerFormFields,
  questionId: number,
  answerId?: number,
) => {
  if (!answerId) await api.answer.create({ ...data, questionId });
  if (answerId) await api.answer.update({ ...data, id: answerId });
  revalidatePath(`/(protected)/survey/[surveyUuid]/answer`, `page`);
};

export const handleRemoveQuestion = async (questionId: number) => {
  await api.question.deleteById({ id: questionId });
  revalidatePath(`/(protected)/survey/[surveyUuid]/configure`, "page");

  // TODO: Add Toaster here
};

export const handleFindManyQuestionsBySurveyId = async (surveyId: number) => {
  await api.question.findManyBySurveyId({ surveyId: surveyId });
  revalidatePath(`/(protected)/survey/[surveyUuid]/answer`, "page");
};
