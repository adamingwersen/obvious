import ValidateQuestions from "@/components/question/validate-questions";
import { api } from "@/trpc/server";
import { handleDeleteQuestionById } from "./actions";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const ValidateSurveyPage = async ({
  params,
}: {
  params: { surveyUuid: string };
}) => {
  const survey = await api.survey.findByUuid({ uuid: params.surveyUuid });
  const questions = survey.questions;

  return (
    <div className="flex h-full flex-col space-y-4 pt-10">
      <div className="relative h-full w-3/5 items-center self-center rounded-md border p-4">
        <ValidateQuestions
          questions={questions}
          handleDeleteQuestion={handleDeleteQuestionById}
        ></ValidateQuestions>
        <Link
          href={`/survey/${params.surveyUuid}/sharing`}
          className="absolute bottom-2 right-2"
        >
          <Button variant="outline" className="flex flex-row space-x-2">
            <p>Start survey</p> <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ValidateSurveyPage;
