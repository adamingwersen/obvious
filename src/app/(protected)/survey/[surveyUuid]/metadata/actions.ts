"use server";

import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";
import { type CreateMetadataQuestionFormFields } from "../_components/MetadataDynamicForm";
import { redirect } from "next/navigation";

export const handleCreateManySurveyMetadata = async (
  data: CreateMetadataQuestionFormFields,
  surveyUuid: string,
) => {
  const surveyId = await api.survey.findById({ uuid: surveyUuid });
  const modifiedData = data.metadataQuestionFields.map((metadata) => {
    return {
      id: metadata.id,
      title: metadata.title,
      metadataType: metadata.metadataType,
      surveyId: surveyId.id,
    };
  });

  await api.metadataQuestion.createMany(modifiedData);
  revalidatePath(`/(protected)/survey/[surveyUuid]/metadata`, "page");
  redirect(`/survey/${surveyUuid}/configure`);
};
