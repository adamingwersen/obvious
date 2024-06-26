/*
You are a data analyst API capable of text_summarization analysis. 
Summarize the provided text into a concise version, capturing the key points and main ideas. 
Please respond with your analysis directly in JSON format (without using Markdown code blocks or any other formatting). 
The JSON schema should include: {'summary': string, 'key_points': array of strings, 'length': number (number of words in summary)}.


- Question(s) that could be asked to resolve the datapoint
- A short explanation of the legislation, i.e. the disclosure requirement and datapoint.

*/

import { EsrsDataPoint } from "@/types/esrs/esrs-data";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const ESRSPrompt = (datapoint: EsrsDataPoint) => {
  return `
You are an ESG expert. 
Explain ESRS data points so it easy to understand to a layman. 
Do this by constructing questions that resolve the datapoint
Make a short explanation of the legislation in layman terms.

Please respond directly in JSON format (without using Markdown code blocks or any other formatting). 
The JSON schema should include: {'questions': string[], explanation: string}
`;
};

const ESRSPrompt2 = (dp: EsrsDataPoint) => {
  return `
You are an ESG expert. 
You are going to write a JSON. Explain ESRS data points so it easy to understand to a layman. 
Do this by constructing questions that resolve the datapoint
Make a short explanation of the legislation in layman terms.

Now consider the following TypeScript Interface for the JSON schema:

interface Output {
   questions: string[];
   explanation: string;
}

Write the basics section according to the Output schema. 
On the response, include only the JSON.
`;
};

const ESRSFewShot = () => {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "user",
      content: `
Topic: Biodiversity and Ecosystems
Disclosure requirement: E4-1
Transition plan and consideration of biodiversity and ecosystems in strategy and business model
Data point: E4-1_04
Disclosure of time horizons used for analysis (biodiversity and ecosystems)
Data type: Narrative`,
    },
    {
      role: "assistant",
      content: `
            {
                "questions": [
                        "What time horizons are you using for analyzing the impact of your business on biodiversity and ecosystems?",
                        "How do these time horizons align with your overall strategy and business model?"
                ],
                "explanation": "The legislation mandates that companies disclose the specific time horizons they use when analyzing their impact on biodiversity and ecosystems. This narrative disclosure should explain the chosen time frames and how they fit within the broader context of the company's strategy and business model, helping stakeholders understand the temporal scope of the company's biodiversity and ecosystem considerations."
            }`,
    },
  ];
  return messages;
};

const constructESRSMessage = (dp: EsrsDataPoint) => {
  const msg: ChatCompletionMessageParam = {
    role: "user",
    content: `
Topic: ${dp.topic}
Disclosure requirement: ${dp.disclosureRequirement}
${dp.drName}
Data point: ${dp.datapointId}
${dp.datapointName}
Data type: ${dp.xbrlDataType}`,
  };
  return msg;
};

export const ESRSMessages = (dp: EsrsDataPoint) => {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: ESRSPrompt(dp),
    },
  ];
  const fewShotExamples = ESRSFewShot();
  fewShotExamples.forEach((x) => {
    messages.push(x);
  });

  messages.push(constructESRSMessage(dp));
  return messages;
};
