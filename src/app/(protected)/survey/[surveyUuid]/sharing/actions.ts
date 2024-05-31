"use server";

import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";
import { ShareDynamicFormFields } from "../_components/ShareDynamicForm";

export const handleCreateManyRespondents = async (
  data: ShareDynamicFormFields,
) => {
  await api.respondent.createMany(data.emails);
  revalidatePath(`/(protected)/survey/[surveyUuid]/sharing`, "page");
};

export const handleDeleteRespondent = async (
  email: string,
  surveyId: number,
) => {
  await api.respondent.delete({ email: email, surveyId: surveyId });
  revalidatePath(`/(protected)/survey/[surveyUuid]/sharing`, "page");
};
