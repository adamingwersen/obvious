"use server";

import { api } from "@/trpc/server";
import { type FormSchema } from "@/components/forms/schemas/metadata-answer";
import { type MetadataAnswerModel } from "@/server/db/schema";
import { revalidatePath } from "next/cache";

export const handleSubmitMetadataAnswer = async (
  surveyId: number,
  respondentUserId: number,
  data: FormSchema,
) => {
  const newData = data.fields.map((x) => {
    return {
      surveyId,
      id: x.metadataAnswerId,
      createdById: respondentUserId,
      metadataQuestionId: x.questionId,
      response: x.value,
    } as MetadataAnswerModel;
  });

  await api.metadataAnswer.createMany(newData);
  revalidatePath("/respond/identified", "page");
};
