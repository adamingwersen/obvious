import MetadataAnswerForm from "@/components/forms/metadata-answer-form";
import { api } from "@/trpc/server";
import { handleSubmitMetadataAnswer } from "./actions";
import { cookies } from "next/headers";

const RespondentIdentifiedPage = async ({
  params,
}: {
  params: { surveyUuid: string };
}) => {
  const metadataQuestions = await api.metadataQuestion.findManyBySurveyUuid({
    surveyUuid: params.surveyUuid,
  });
  const survey = await api.survey.findByUuid({ uuid: params.surveyUuid });
  const originator = survey.user;

  const respondentUuid = cookies().get("respondent-identifier")?.value;
  if (!respondentUuid) throw new Error("Whoops. Unable to identify respondent");
  const respondent = survey.respondents.find(
    (respondent) => respondent.uuid === respondentUuid,
  );
  if (!respondent) throw new Error("Unable to locate respondent");

  return (
    <div className="flex h-full w-full flex-col justify-center space-y-4 pb-10 pt-10 ">
      <div className="relative flex  w-2/5 flex-col self-center rounded-md border bg-white p-4 pb-10">
        <div className="flex flex-col px-20 pt-10 text-lg font-light">
          <p>Let&apos;s get started...</p>
          <p className="text-xl text-muted-foreground">
            {originator.firstName} would like to know a few basic things about
            your company
          </p>
        </div>
        <MetadataAnswerForm
          metadataQuestions={metadataQuestions}
          surveyUuid={params.surveyUuid}
          respondent={respondent}
          handleSubmitMetadataAnswer={handleSubmitMetadataAnswer}
        />
      </div>
    </div>
  );
};

export default RespondentIdentifiedPage;
