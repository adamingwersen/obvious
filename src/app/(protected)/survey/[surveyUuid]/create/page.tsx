import { api } from "@/trpc/server";
import { handleESRSDatapoint } from "@/server/actions/ai/open-ai";

import {
  handleUpsertQuestions,
  handleDeleteQuestion,
} from "@/server/actions/questions/actions";
import CreateQuestionsView from "@/components/question/create-question-view";
import { QuestionActionProvider } from "@/hooks/server-actions/questions";

const CreateSurveyIdPage = async ({
  params,
}: {
  params: { surveyUuid: string };
}) => {
  const survey = await api.survey.findByUuid({ uuid: params.surveyUuid });
  const questions = survey.questions;

  return (
    <div className="flex h-full">
      <QuestionActionProvider
        pathToRevalidate="/(protected)/survey/[surveyUuid]/create"
        handleDeleteQuestion={handleDeleteQuestion}
        handleUpsertQuestions={handleUpsertQuestions}
      >
        <CreateQuestionsView
          survey={survey}
          initialQuestions={questions}
          handleHelpESRSDatapoint={handleESRSDatapoint}
        ></CreateQuestionsView>
      </QuestionActionProvider>
    </div>
  );
};

export default CreateSurveyIdPage;
