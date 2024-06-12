import { type AnswerModel, type QuestionModel } from "@/server/db/schema";
import { type Translation } from "@/types/translation";

export type Question = {
  id: number;
  title: string;
  content: string;
  translations: Translation[];
  existingAnswer: {
    id: number;
    content: string;
    translations: Translation[];
    filePaths: string[];
  } | null;
};

export type QuestionWithAnswers = QuestionModel & {
  answers: AnswerModel[];
};
