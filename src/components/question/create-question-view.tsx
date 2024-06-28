"use client";

import { QuestionModel, SurveyModel } from "@/server/db/schema";
import { EsrsDataPoint, esrsDataType } from "@/types/esrs/esrs-data";
import { ScrollArea } from "../ui/scroll-area";
import QuestionRow from "./question-row";
import CreateQuestionForm from "../forms/create-question-form";
import Link from "next/link";

import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import ESRSSelector from "./esrs-selector";
import { useState } from "react";

//Top level component to handle the states between the question list, the current form and the esrs selector

type CreateQuestionViewProps = {
  survey: SurveyModel;
  questions: QuestionModel[];
  handleHelpESRSDatapoint: (dp: EsrsDataPoint) => Promise<string>;
};

export type ESRSTags = {
  topic?: string;
  disclosureRequirement?: string;
  datapoint?: string;
  dataType?: esrsDataType;
};

const CreateQuestionsView = ({
  survey,
  questions,
  handleHelpESRSDatapoint,
}: CreateQuestionViewProps) => {
  const [tags, setTags] = useState<ESRSTags>({});
  return (
    <div className="mx-auto flex w-full">
      <ScrollArea className="absolute h-full w-1/3 rounded-md border px-4 py-2">
        <h1 className="mb-4 text-xl font-light">Questions</h1>
        {questions.map((question) => (
          <QuestionRow
            surveyUuid={survey.uuid}
            question={question}
            key={question.id}
          />
        ))}
        <QuestionRow surveyUuid={survey.uuid}></QuestionRow>
      </ScrollArea>
      <div className="relative w-full max-w-3xl flex-col px-4 pt-10">
        <div className=" mx-auto rounded-md border px-16 py-4 ">
          <CreateQuestionForm
            surveyId={survey.id}
            setTags={setTags}
            tags={tags}
          />
          <div className="absolute bottom-16 right-4">
            <Link href={`/survey/${survey.uuid}/validate`}>
              <Button variant="outline" className="flex flex-row space-x-2">
                <p>Finish</p> <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <ScrollArea className="absolute h-full w-1/2 rounded-md border px-4">
        <ESRSSelector
          gippity={handleHelpESRSDatapoint}
          setTags={setTags}
          tags={tags}
        />
      </ScrollArea>
    </div>
  );
};

export default CreateQuestionsView;
