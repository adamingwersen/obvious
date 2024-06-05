"use server";

import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import { type ValidateRespondentFormFields } from "./page";
import { cookies } from "next/headers";

export const handleValidateRespondent = async (
  surveyUuid: string,
  data: ValidateRespondentFormFields,
) => {
  const survey = await api.survey.findByUuid({ uuid: surveyUuid });

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
  cookies().set("respondent-identifier", respondent.uuid, { secure: true });
  redirect(`/respond/${surveyUuid}/identified`);
};
