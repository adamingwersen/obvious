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

  const mappedMetadataQuestions = metadataQuestions.map((mq) => {
    const answer = mq.metadataAnswer.find(
      (ma) => ma.createdById === respondentUser.respondentUserId,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { metadataAnswer: _, ...rest } = mq;
    return { ...rest, answer };
  });

  return (
    <div className="flex h-full w-full flex-col justify-center space-y-4 pb-10 pt-10 ">
      <div className="relative flex w-4/5 flex-col self-center border bg-white p-4 pb-10 lg:w-2/5">
        <div className="flex flex-col px-20 pt-10 text-lg font-light">
          <p>Let&apos;s get started...</p>
          <p className="text-xl text-muted-foreground">
            {originator.firstName} would like to know a few basic things about
            your company
          </p>
        </div>
        <MetadataAnswerForm
          metadataQuestions={mappedMetadataQuestions}
          surveyId={survey.id}
          respondentUserId={respondentUser.respondentUserId}
          handleSubmitMetadataAnswer={handleSubmitMetadataAnswer}
        />
      </div>
    </div>
  );
};

export default RespondentIdentifiedPage;
