import AnswerStepper from "@/app/(protected)/survey/[surveyUuid]/_components/AnswerStepper";
import { api } from "@/trpc/server";

// Answer page data types
export type Translation = {
  language: string;
  translatedContent: string;
};

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

const AnswerSurveyIdPage = async ({
  params,
}: {
  params: { surveyUuid: string };
}) => {
  // Fetch survey with questions
  const survey = await api.survey.findById({ uuid: params.surveyUuid });
  const questions = survey.questions;

  // Fetch existing answers for survey questions
  const questionIds = questions.map((question) => question.id);
  const userAnswers = await api.answer.findManyByQuestionIds({
    questionIds: questionIds,
  });
  // Fetch translations for questions in survey
  const questionsTranslations = await api.translation.findManyByQuestionIds({
    questionIds: questionIds,
  });

  // Construct data model
  const mappedQuestions = questions.map((q) => {
    const foundAnswer = userAnswers.find((a) => a.questionId === q.id);
    const questionTranslations = questionsTranslations.filter(
      (t) => t.questionId === q.id,
    );

    return {
      id: q.id,
      title: q.title,
      content: q.content,
      translations: questionTranslations,
      existingAnswer: foundAnswer
        ? {
            id: foundAnswer.id,
            content: foundAnswer.content,
            filePaths: foundAnswer.documentIds ?? [],
            translations: [], // We dont have translations for answers yet
          }
        : null,
    };
  });

  return (
    <div className="flex h-full flex-col space-y-4 pt-10">
      <AnswerStepper questions={mappedQuestions} />
    </div>
  );
};

export default AnswerSurveyIdPage;
