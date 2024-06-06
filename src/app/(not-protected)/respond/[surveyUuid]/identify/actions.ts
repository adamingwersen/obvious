"use server";

import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import { type ValidateRespondentFormFields } from "./page";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

export const handleValidateRespondent = async (
  surveyUuid: string,
  formFields: ValidateRespondentFormFields,
) => {
  const survey = await api.survey.findByUuid({ uuid: surveyUuid });

  if (!survey) redirect(`/respond/${surveyUuid}/rejected`);
  const respondent = await api.respondent.validate({
    email: formFields.email,
    surveyId: survey.id,
  });
  if (!respondent) redirect(`/respond/${surveyUuid}/rejected`);
  const updated = await api.respondent.updateFirstSeenAt({
    id: respondent.id,
    surveyId: respondent.surveyId,
  });
  if (!updated) redirect(`/respond/${surveyUuid}/rejected`);

  // const urlParams = new URLSearchParams(Array.from(searchParams.entries()));

  // const { data, error } = await supabase.auth.verifyOtp({
  //   token_hash: tokenHash,
  //   type: "magiclink",
  // });

  cookies().set("respondent-identifier", respondent.uuid, { secure: true });
  redirect(`/respond/${surveyUuid}/identified`);
};
