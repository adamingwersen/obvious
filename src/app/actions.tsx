"use server";

import { api } from "@/trpc/server";

interface createTranslationInDbParams {
  translatedContent: string;
  language: string;
  answerId?: number;
  questionId?: number;
}

export async function createTranslationInDb(
  params: createTranslationInDbParams,
) {
  await api.translation.create(params);
}
