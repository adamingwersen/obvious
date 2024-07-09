import {
  type MetadataAnswerModel,
  type MetadataQuestionModel,
} from "@/server/db/schema";

export type MetadataQuestionWithRespondentAnswer = MetadataQuestionModel & {
  answer: MetadataAnswerModel | undefined;
};
