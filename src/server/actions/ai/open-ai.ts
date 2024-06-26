"use server";

import { api } from "@/trpc/server";
import { EsrsDataPoint } from "@/types/esrs/esrs-data";
import { MessagesSquare } from "lucide-react";
import OpenAI from "openai";
import {
  ChatCompletionAssistantMessageParam,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from "openai/resources/index.mjs";
import { ESRSMessages } from "./prompts";

interface createTranslationInDbParams {
  translatedContent: string;
  language: string;
  answerId?: number;
  questionId?: number;
}

interface Msg {
  role: "system" | "user" | "assistant";
  content: string;
}

// interface chatCompletionParams {
//   messages: ChatCompletionAssistantMessageParam[];
//   model?: string;
//   responseType: "text" | "json_object";
// }

const chatCompletion = async (
  params: ChatCompletionCreateParamsNonStreaming,
) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await openai.chat.completions.create(params);
  const data = completion.choices[0];
  if (!data) throw new Error("OpenAI: Didn't get a response");
  if (!data.message.content) throw new Error("OpenAI: No message content");
  return data.message.content;
};

export const handleTranslate = async (
  content: string,
  targetLangName: string,
) => {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a professional translation engine. Please translate the text into ${targetLangName} without explanation.`,
    },
    { role: "user", content: content },
  ];

  const translation = await chatCompletion({
    messages: messages,
    model: "gpt-3.5-turbo",
    response_format: { type: "text" },
  });
  return { translation: translation };
};

export const handleESRSDatapoint = async (datapoint: EsrsDataPoint) => {
  const messages = ESRSMessages(datapoint);

  const esrsDatapointHelp = await chatCompletion({
    messages: messages,
    model: "gpt-4o",
    response_format: { type: "json_object" },
  });
  return esrsDatapointHelp;
};

export async function createTranslationInDb(
  params: createTranslationInDbParams,
) {
  await api.translation.create(params);
}
