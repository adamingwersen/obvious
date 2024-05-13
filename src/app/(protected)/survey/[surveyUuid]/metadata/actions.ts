"use server";

import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";
import { type CreateSurveyMetadataFormFields } from "../_components/MetadataDynamicForm";
import { redirect } from "next/navigation";

export const handleCreateManySurveyMetadata = async (
  data: CreateSurveyMetadataFormFields,
  surveyUuid: string,
) => {
  const surveyId = await api.survey.findById({ uuid: surveyUuid });
  const modifiedData = data.surveyMetadataFields.map((surveyMetadata) => {
    return {
      id: surveyMetadata.id,
      title: surveyMetadata.title,
      metadataType: surveyMetadata.metadataType,
      surveyId: surveyId.id,
    };
  });

  await api.surveyMetadata.createMany(modifiedData);
  revalidatePath(`/(protected)/survey/[surveyUuid]/metadata`, "page");
  redirect(`/survey/${surveyUuid}/configure`);
};
