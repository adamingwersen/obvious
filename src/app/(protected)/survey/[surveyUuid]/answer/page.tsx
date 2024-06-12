import { api } from "@/trpc/server";

import ViewAnswers from "@/components/answer/view-answers";
import { HandleCreateSignedLink } from "./actions";

const AnswerSurveyIdPage = async ({
  params,
}: {
  params: { surveyUuid: string };
}) => {

  const survey = await api.survey.findByUuidFull({ uuid: params.surveyUuid });
  
  return (
    <div className="mx-auto h-full w-2/3 pt-10 ">
      <ViewAnswers
        questions={survey.questions}
        respondents={survey.respondents}
        handleCreateDownloadLink={HandleCreateSignedLink}
      ></ViewAnswers>
    </div>
  );
};

export default AnswerSurveyIdPage;
