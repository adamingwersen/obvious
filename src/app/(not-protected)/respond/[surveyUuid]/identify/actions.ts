"use server";

import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import { type ValidateRespondentFormFields } from "./page";
import { cookies } from "next/headers";

export const handleValidateRespondent = async (
  surveyUuid: string,
  formFields: ValidateRespondentFormFields,
) => {
  const survey = await api.survey.findByUuid({ uuid: surveyUuid });

  if (!survey) redirect(`/respond/${surveyUuid}/rejected`);

  try {
    const validatedRespondent = await api.surveyRespondent.validate({
      email: formFields.email,
      surveyId: survey.id,
    });
    const updated = await api.surveyRespondent.updateFirstSeenAt({
      respondentUserId: validatedRespondent.respondentUserId,
      surveyId: validatedRespondent.surveyId,
    });
    if (!updated) redirect(`/respond/${surveyUuid}/rejected`);
    cookies().set("respondent-identifier", validatedRespondent.uuid, {
      secure: true,
    });
    redirect(`/respond/${surveyUuid}/identified`);
  } catch (error) {
    redirect(`/respond/${surveyUuid}/rejected`);
  }
};
