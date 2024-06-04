import { api } from "@/trpc/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AnswerSurveyIdPage = async ({
  params,
}: {
  params: { surveyUuid: string };
}) => {
  // Fetch survey with questions
  const survey = await api.survey.findById({ uuid: params.surveyUuid });
  const questions = survey.questions;

  // Fetch existing answers for survey questions
  const questionIds = questions.map((question) => question.id);
  const answers = await api.answer.findManyByQuesitionIds({
    questionIds: questionIds,
  });

  // Construct data model
  const mappedQuestions = questions.map((q) => {
    const foundAnswers = answers.filter((a) => a.questionId === q.id);

    return {
      id: q.id,
      title: q.title,
      content: q.content,
      answers: foundAnswers,
    };
  });

  return (
    <div className="mx-auto h-full w-2/3 pt-10 ">
      <Accordion type="multiple" className="w-full">
        {mappedQuestions.map((question, i) => {
          return (
            <AccordionItem value={`item-${i}`}>
              <AccordionTrigger>{question.content}</AccordionTrigger>
              <AccordionContent>
                {question.answers.map((a, j) => {
                  return (
                    <div className="flex justify-between">
                      <div className="flex">
                        <p className="font-semibold">Answer:</p>
                        <p>{a.content}</p>
                      </div>
                      <div className="flex">
                        <p className="font-semibold">Answer by:</p>
                        <p> {a.createdById}</p>
                      </div>
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default AnswerSurveyIdPage;
