import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

type TranslationRequestBodyType = {
  text: string;
  targetLangName: string;
};

export async function POST(request: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const body = (await request.json()) as TranslationRequestBodyType;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a professional translation engine. Please translate the text into ${body.targetLangName} without explanation.`,
      },
      { role: "user", content: body.text },
    ],
    model: "gpt-3.5-turbo",
  });

  const data = completion.choices[0];

  return NextResponse.json({ translation: data?.message.content });
}
