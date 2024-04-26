"use server";

import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";

export const handleArchiveSurvey = async (surveyId: number) => {
  await api.survey.archiveById({ id: surveyId });
  revalidatePath(`/(protected)/survey`, "page");
  // TODO: Add Toaster here
};
