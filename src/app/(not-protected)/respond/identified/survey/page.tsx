import { api } from "@/trpc/server";
import AnswerStepper from "@/components/answer/answer-stepper";
import {
  handleUpsertAnswer,
  handleDeleteFilesFromAnswer,
  handleGetQuestionsAnswers,
} from "./actions";
import { handleTranslate } from "@/app/actions";
import { getRespondent } from "@/app/(not-protected)/respond/actions";
import { redirect } from "next/navigation";
// Answer page data types

const RespondentSurveyPage = async () => {
  const respondentUser = await getRespondent();
  if (!respondentUser) redirect("/respond/rejected");
  // Fetch survey with questions
  const survey = await api.survey.findById({ id: respondentUser.surveyId });
  const questions = survey.questions;

  // Fetch existing answers for survey questions
  const questionIds = questions.map((question) => question.id);

  const userAnswers = await api.answer.findManyByQuestionIdsForRespondent({
    questionIds: questionIds,
  });
  const respondentAnswers = await handleGetQuestionsAnswers(questionIds);

  // Fetch translations for questions in survey
  const questionsTranslations =
    await api.translation.findManyByQuestionIdsWithJwt({
      questionIds: questionIds,
    });

  // Construct data model
  const mappedQuestions = questions.map((q) => {
    const foundAnswer = respondentAnswers.find((a) => a.questionId === q.id);
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
            filePaths: foundAnswer.documentUrls ?? [],
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
          handleTranslateFunc={handleTranslate}
        />
      </div>
    </div>
  );
};

export default RespondentSurveyPage;
