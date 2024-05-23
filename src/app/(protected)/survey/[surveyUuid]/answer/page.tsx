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

  const questionIds = questions.map((question) => question.id);
  const userAnswers = await api.answer.findManyByQuestionIds({
    questionIds: questionIds,
  });
  const mappedQuestions = questions.map((q) => {
    const foundAnswer = userAnswers.find((a) => a.questionId === q.id);
    return {
      id: q.id,
      content: q.content,
      existingAnswer: foundAnswer
        ? {
            id: foundAnswer.id,
            content: foundAnswer.content,
            filePaths: foundAnswer.documentIds ?? [],
          }
        : null,
    };
  });

  return (
    <div className="flex h-full flex-col space-y-4 pt-10">
      <AnswerStepper questions={mappedQuestions} />
    </div>
  );
};

export default AnswerSurveyIdPage;
