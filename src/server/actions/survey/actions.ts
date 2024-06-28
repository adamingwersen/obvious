"use server";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";

export const handleRenameSurveyName = async (
  surveyId: number,
  newName: string,
  pathToRevalidate?: string,
) => {
  await api.survey.updateSurvey({ id: surveyId, title: newName });
  if (pathToRevalidate) revalidatePath(pathToRevalidate, "page");
};
