import AnswerStepper from "@/app/(protected)/survey/[surveyUuid]/_components/AnswerStepper";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/server";

const AnswerSurveyIdPage = async ({
  params,
}: {
  params: { surveyUuid: string };
}) => {
  const survey = await api.survey.findById({ uuid: params.surveyUuid });
  const questions = survey.questions;

  return (
    <div className="flex h-full flex-col space-y-4 pt-10">
      <AnswerStepper questions={questions} />
    </div>
  );
};

export default AnswerSurveyIdPage;
