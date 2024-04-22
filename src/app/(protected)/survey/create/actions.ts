"use server";

import { redirect } from "next/navigation";
import { type CreateSurveyFormFields } from "./page";
import { api } from "@/trpc/server";

export const handleCreateSurveyFormSubmit = async (
  data: CreateSurveyFormFields,
) => {
  const newSurvey = await api.survey.create(data);

  redirect(`/survey/configure/${newSurvey.uuid}`);
};
