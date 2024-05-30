import MetadataForm from "./metadata";
import { api } from "@/trpc/server";

const RespondentIdentifiedPage = async ({
  params,
}: {
  params: { surveyUuid: string };
}) => {
  const metadataQuestions = await api.metadataQuestion.findManyBySurveyUuid({
    surveyUuid: params.surveyUuid,
  });
  const survey = await api.survey.findById({ uuid: params.surveyUuid });
  const originator = survey.user;

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
        <MetadataForm
          metadataQuestions={metadataQuestions}
          surveyUuid={params.surveyUuid}
        />
      </div>
    </div>
  );
};

export default RespondentIdentifiedPage;
