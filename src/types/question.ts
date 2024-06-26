import { type AnswerModel, type QuestionModel } from "@/server/db/schema";
import { type Translation } from "@/types/translation";

export type Question = {
  id: number;
  title: string;
  content: string;
  translations: Translation[];
  existingAnswer: AnswerModel;
};

export type QuestionWithAnswers = QuestionModel & {
  answers: AnswerModel[];
};

export type GippityESRSHelp = {
  questions: string[];
  explanation: string;
};
