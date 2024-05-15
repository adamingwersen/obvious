"use server";

import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import { type ValidateRespondentFormFields } from "./page";

export const handleValidateRespondent = async (
  surveyUuid: string,
  data: ValidateRespondentFormFields,
) => {
  const survey = await api.survey.findById({ uuid: surveyUuid });

  if (!survey) redirect(`/respond/${surveyUuid}/rejected`);
  const respondent = await api.respondent.validate({
    email: data.email,
    surveyId: survey.id,
  });
  if (!respondent) redirect(`/respond/${surveyUuid}/rejected`);
  const updated = await api.respondent.updateFirstSeenAt({
    id: respondent.id,
    surveyId: respondent.surveyId,
  });
  if (!updated) redirect(`/respond/${surveyUuid}/rejected`);
  redirect(`/respond/${surveyUuid}/identified`);
};
