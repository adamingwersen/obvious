import { api } from "@/trpc/server";
import AnswerStepper from "@/components/answer/answer-stepper";
import { handleUpsertAnswer, handleDeleteFilesFromAnswer } from "./actions";

// Answer page data types

const RespondentQuestionnairePage = async ({
  params,
}: {
  params: { surveyUuid: string };
}) => {
  // Fetch survey with questions
  const survey = await api.survey.findById({ uuid: params.surveyUuid });
  const questions = survey.questions;

  // Fetch existing answers for survey questions
  const questionIds = questions.map((question) => question.id);
  const userAnswers = await api.answer.findManyByQuestionIdsForUser({
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
    <div className="flex h-full w-full flex-col justify-center space-y-4 pb-10 pt-10 ">
      <div className="relative flex  w-2/5 flex-col self-center rounded-md border bg-white p-4 pb-10">
        <AnswerStepper
          questions={mappedQuestions}
          handleDeleteFileFunc={handleDeleteFilesFromAnswer}
          handleUpsertFileFunc={handleUpsertAnswer}
        />
      </div>
    </div>
  );
};

export default RespondentQuestionnairePage;
