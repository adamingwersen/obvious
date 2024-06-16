import MetadataAnswerForm from "@/components/forms/metadata-answer-form";
import { api } from "@/trpc/server";
import { handleSubmitMetadataAnswer } from "./actions";
import { getRespondent } from "@/app/(not-protected)/respond/actions";
import { redirect } from "next/navigation";

const RespondentIdentifiedPage = async () => {
  const respondentUser = await getRespondent();
  if (!respondentUser) redirect("/respond/rejected");
  const metadataQuestions = await api.metadataQuestion.findManyBySurveyId({
    surveyId: respondentUser.surveyId,
  });
  const survey = await api.survey.findById({ id: respondentUser.surveyId });
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
        <MetadataAnswerForm
          metadataQuestions={metadataQuestions}
          surveyUuid={survey.uuid}
          respondent={respondentUser}
          handleSubmitMetadataAnswer={handleSubmitMetadataAnswer}
        />
      </div>
    </div>
  );
};

export default RespondentIdentifiedPage;
