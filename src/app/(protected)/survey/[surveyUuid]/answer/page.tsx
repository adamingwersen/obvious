import { api } from "@/trpc/server";

import ViewAnswers from "@/components/answer/view-answers";
import { handleCreateSignedLink } from "./actions";

const AnswerSurveyIdPage = async ({
  params,
}: {
  params: { surveyUuid: string };
}) => {
  const survey = await api.survey.findByUuidFull({ uuid: params.surveyUuid });
  const respondentIds = survey.respondents.map((respondent) => {
    return {
      id: respondent.respondentUserId,
    };
  });
  if (!respondentIds) throw new Error("No respondents");
  const respondents = await api.user.findManyById(respondentIds);

  return (
    <div className="mx-auto h-full w-2/3 pt-10 ">
      <ViewAnswers
        questions={survey.questions}
        respondents={respondents}
        handleCreateDownloadLink={handleCreateSignedLink}
      ></ViewAnswers>
    </div>
  );
};

export default AnswerSurveyIdPage;
