import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import QuestionRow from "@/components/question/question-row";
import CreateQuestionForm from "@/components/forms/create-question-form";

import { handleUpsertQuestion, handleDeleteQuestion } from "./actions";

const CreateQuestionPage = async ({
  params,
}: {
  params: { surveyUuid: string };
}) => {
  const survey = await api.survey.findById({ uuid: params.surveyUuid });
  const questions = survey.questions;

  return (
    <div className="flex h-full">
      <ScrollArea className="absolute h-full w-[18vw] rounded-md border p-4">
        <h4 className="text-m mb-4 font-medium leading-none ">Questions</h4>
        {questions.map((question) => (
          <QuestionRow
            question={question}
            key={question.id}
            handleDeleteQuestion={handleDeleteQuestion}
          />
        ))}
      </ScrollArea>
      <div className="-ml-[18vw] flex w-full flex-col justify-between  pb-6">
        <div className="mb-auto pt-10">
          <CreateQuestionForm
            surveyId={survey.id}
            handleUpsertQuestion={handleUpsertQuestion}
          />
        </div>
        <Link
          href={`/survey/${params.surveyUuid}/validate`}
          className="self-end"
        >
          <Button variant="outline" className="flex flex-row space-x-2">
            <p>Finish</p> <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CreateQuestionPage;
