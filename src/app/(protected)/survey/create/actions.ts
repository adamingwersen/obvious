"use server";

import { redirect } from "next/navigation";
import { type CreateSurveyFormFields } from "@/components/forms/schemas/create-survey";
import { api } from "@/trpc/server";

export const handleCreateSurvey = async (data: CreateSurveyFormFields) => {
  const newSurvey = await api.survey.create(data);
  if (!newSurvey) throw new Error("API: Couldn't create survey");
  redirect(`/survey/${newSurvey.uuid}/metadata`);
};
