"use server";

import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import { type CreateMetadataAnswerFormFields } from "@/components/forms/schemas/metadata-answer";
import { type MetadataAnswerModel } from "@/server/db/schema";
import { cookies } from "next/headers";

export const handleSubmitMetadataAnswer = async (
  surveyUuid: string,
  data: CreateMetadataAnswerFormFields,
) => {
  const survey = await api.survey.findByUuid({ uuid: surveyUuid });
  if (!survey) throw new Error("Whoops. Survey doesn't exsit");
  const respondent_uuid = cookies().get("respondent-identifier")?.value;
  if (!respondent_uuid)
    throw new Error("Whoops. Unable to identify respondent");
  const respondent = await api.respondent.findByUuid({ uuid: respondent_uuid });
  if (!respondent) throw new Error("Whoops. Unable to identify respondent");
  const formattedData: MetadataAnswerModel[] = data.data.map((response) => {
    return {
      createdById: respondent.id,
      surveyId: survey.id,
      metadataQuestionId: response.questionId,
      response: response.response,
      metadataType: response.metadataType,
    } as MetadataAnswerModel;
  });
  const metadataAnswers = await api.metadataAnswer.createMany(formattedData);
  if (!metadataAnswers) throw new Error("Whoops. That went wrong");
  redirect(`/respond/${surveyUuid}/identified/survey`);
};
