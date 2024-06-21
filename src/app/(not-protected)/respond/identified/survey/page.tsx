import { api } from "@/trpc/server";
import AnswerStepper from "@/components/answer/answer-stepper";
import { handleGetQuestionsAnswers } from "./actions";
import { handleTranslate } from "@/app/actions";
import { getRespondent } from "@/app/(not-protected)/respond/actions";
import { redirect } from "next/navigation";
import { FileActionsProvider } from "@/hooks/use-files";
import {
  handleAddFilePath,
  handleDeleteFile,
  handleDownloadFile,
  handleUpsertAnswer,
} from "@/server/actions/answer/actions";
// Answer page data types

const RespondentSurveyPage = async () => {
  const respondentUser = await getRespondent();
  if (!respondentUser) redirect("/respond/rejected");
  // Fetch survey with questions
  const survey = await api.survey.findById({ id: respondentUser.surveyId });
  const questions = survey.questions;

  // Fetch existing answers for survey questions
  const questionIds = questions.map((question) => question.id);

  const respondentAnswers = await handleGetQuestionsAnswers(questionIds);

  // Fetch translations for questions in survey
  const questionsTranslations =
    await api.translation.findManyByQuestionIdsWithJwt({
      questionIds: questionIds,
    });

  // Construct data model
  const mappedQuestions = await Promise.all(
    questions.map(async (q) => {
      let answer = null;
      const existingAnswer = respondentAnswers.find(
        (a) => a.questionId === q.id,
      );
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

      return {
        id: q.id,
        title: q.title,
        content: q.content,
        translations: questionTranslations,
        existingAnswer: answer,
      };
    }),
  );

  return (
    <div className="flex h-full w-full flex-col justify-center space-y-4 pb-10 pt-10 ">
      <div className="relative flex  w-2/5 flex-col self-center rounded-md border bg-white p-4 pb-10">
        <FileActionsProvider
          downloadFile={handleDownloadFile}
          deleteFile={handleDeleteFile}
          addFileToAnswer={handleAddFilePath}
          pathToRevalidate="/(not-protected)/respond/identified/survey"
        >
          <AnswerStepper
            questions={mappedQuestions}
            handleUpsertAnswer={handleUpsertAnswer}
            handleTranslate={handleTranslate}
          />
        </FileActionsProvider>
      </div>
    </div>
  );
};

export default RespondentSurveyPage;
