"use server";

import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import { type CreateMetadataAnswerFormFields } from "@/components/forms/schemas/metadata-answer";
import { type MetadataAnswerModel } from "@/server/db/schema";

export const handleSubmitMetadataAnswer = async (
  surveyUuid: string,
  respondentUserId: number,
  data: CreateMetadataAnswerFormFields,
) => {
  const survey = await api.survey.findByUuid({ uuid: surveyUuid });
  if (!survey) throw new Error("Whoops. Survey doesn't exsit");

  const formattedData: MetadataAnswerModel[] = data.data.map((response) => {
    return {
      createdById: respondentUserId,
      surveyId: survey.id,
      metadataQuestionId: response.questionId,
      response: response.response,
      metadataType: response.metadataType,
    } as MetadataAnswerModel;
  });
  const metadataAnswers = await api.metadataAnswer.createMany(formattedData);
  if (!metadataAnswers) throw new Error("Whoops. That went wrong");
  redirect(`/respond/identified/survey`);
};
