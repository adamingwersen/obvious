"use server";

import { api } from "@/trpc/server";
import OpenAI from "openai";

interface createTranslationInDbParams {
  translatedContent: string;
  language: string;
  answerId?: number;
  questionId?: number;
}

export const handleTranslate = async (
  content: string,
  targetLangName: string,
) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a professional translation engine. Please translate the text into ${targetLangName} without explanation.`,
      },
      { role: "user", content: content },
    ],
    model: "gpt-3.5-turbo",
  });
  const data = completion.choices[0];
  if (!data) throw new Error("OpenAI: No translation made");
  if (!data.message.content) throw new Error("OpenAI: No message content");
  return { translation: data.message.content };
};

export async function createTranslationInDb(
  params: createTranslationInDbParams,
) {
  await api.translation.create(params);
}
