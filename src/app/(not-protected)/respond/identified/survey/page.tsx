import { api } from "@/trpc/server";
import AnswerStepper from "@/components/answer/answer-stepper";

import { handleTranslate } from "@/app/actions";
import { getRespondent } from "@/app/(not-protected)/respond/actions";
import { redirect } from "next/navigation";
import { FileActionsProvider } from "@/hooks/use-files";
import {
  handleAddFilePath,
  handleCantAnswer,
  handleDeleteFile,
  handleDownloadFile,
  handleUpsertAnswer,
} from "@/server/actions/answer/actions";
import { AnswerActionProvider } from "@/hooks/server-actions/answers";

const RespondentSurveyPage = async () => {
  const respondentUser = await getRespondent();
  if (!respondentUser) redirect("/respond/rejected");
  // Fetch survey with questions
  const survey = await api.survey.findById({ id: respondentUser.surveyId });
  const questions = survey.questions;

  // Fetch translations for questions in survey
  const questionIds = questions.map((question) => question.id);
  const questionsTranslations =
    await api.translation.findManyByQuestionIdsWithJwt({
      questionIds: questionIds,
    });

  // Construct data model
  const mappedQuestions = await Promise.all(
    questions.map(async (q) => {
      let answer = null;
      const existingAnswer = q.answers
        .filter((a) => a.createdById === respondentUser.respondentUserId)
        .find((a) => a.questionId === q.id);
      // Construct questions in db if they dont exist
      // A bit of an antipattern, but make life so much easier
      //  when handling file uploads that needs an answer id
      if (!existingAnswer) {
        const createdAnswer = await api.answer.create({
          questionId: q.id,
          content: "",
          documentUrls: [],
        });
        answer = createdAnswer[0];
        if (!answer) throw new Error("failed to create answer");
      } else {
        answer = existingAnswer;
      }
      const questionTranslations = questionsTranslations.filter(
        (t) => t.questionId === q.id,
      );
      return { ...q, answer: answer, translations: questionTranslations };
    }),
  );

  return (
    <div className="flex h-full w-full flex-col justify-center space-y-4">
      <div className="relative h-5/6 w-4/5 self-center bg-white p-8 lg:w-3/5 xl:w-2/5">
        <FileActionsProvider
          downloadFile={handleDownloadFile}
          deleteFile={handleDeleteFile}
          addFileToAnswer={handleAddFilePath}
          pathToRevalidate="/(not-protected)/respond/identified/survey"
        >
          <AnswerActionProvider
            handleUpsertAnswer={handleUpsertAnswer}
            handleCantAnswer={handleCantAnswer}
            pathToRevalidate="/(not-protected)/respond/identified/survey"
          >
            <AnswerStepper
              questions={mappedQuestions}
              handleTranslate={handleTranslate}
            />
          </AnswerActionProvider>
        </FileActionsProvider>
      </div>
    </div>
  );
};

export default RespondentSurveyPage;
