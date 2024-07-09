import { type AnswerModel, type QuestionModel } from "@/server/db/schema";
import { type Translation } from "@/types/translation";

export type QuestionWithRespondentAnswer = QuestionModel & {
  translations: Translation[];
  answer: AnswerModel;
};

export type QuestionWithAnswers = QuestionModel & {
  answers: AnswerModel[];
};

export type GippityESRSHelp = {
  questions: string[];
  explanation: string;
};
