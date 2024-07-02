"use client";

import { type SurveyModel } from "@/server/db/schema";
import { type EsrsDataPoint, type esrsDataType } from "@/types/esrs/esrs-data";
import { ScrollArea } from "../ui/scroll-area";
import { QuestionRow } from "./question-row";
import CreateQuestionForm from "../forms/create-question-form-client-side";
import Link from "next/link";
import { useQuestionActions } from "@/hooks/server-actions/questions";

import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import ESRSSelector from "./esrs-selector";
import { useEffect, useState } from "react";
import { QuestionList } from "./question-list";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  type upsertQuestionsType,
  type upsertQuestionType,
} from "../forms/schemas/create-question";

type CreateQuestionViewProps = {
  survey: SurveyModel;
  initialQuestions: upsertQuestionsType;
  handleHelpESRSDatapoint: (dp: EsrsDataPoint) => Promise<string>;
};

export type ESRSTags = {
  topic?: string;
  disclosureRequirement?: string;
  datapoint?: string;
  dataType?: esrsDataType;
};

//Top level component to handle the states between the question list, the current form and the esrs selector
const CreateQuestionsView = ({
  survey,
  initialQuestions,
  handleHelpESRSDatapoint,
}: CreateQuestionViewProps) => {
  const [tags, setTags] = useState<ESRSTags>({});

  // const addQuestion = () => {
  //   setQuestions((prev) => [
  //     ...prev,
  //     {
  //       title: "",
  //       content: "",
  //     },
  //   ]);
  // };

  const { upsertQuestions } = useQuestionActions;

  const [questions, setQuestions] =
    useState<upsertQuestionsType>(initialQuestions);

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);

  let selectedQuestion: upsertQuestionType | null;
  if (selectedQuestionIndex !== null) {
    selectedQuestion = questions[selectedQuestionIndex] ?? null;
  }

  useEffect(() => {
    console.log("selectedQuestionIndex", selectedQuestionIndex);
  }, [selectedQuestionIndex]);

  const onSaveQuestions = async () => {
    console.log("I want to save questions");
  };

  return (
    <div className="mx-auto flex w-full">
      <ScrollArea className="absolute h-full w-1/3 rounded-md border px-4 py-2">
        <h1 className="mb-4 text-xl font-light">Questions</h1>
        <DndProvider backend={HTML5Backend}>
          <QuestionList
            questions={questions}
            setQuestions={setQuestions}
            selectedQuestionIndex={selectedQuestionIndex}
            setSelectedQuestionIndex={setSelectedQuestionIndex}
          ></QuestionList>
        </DndProvider>
        {/*  Add new question row */}
        <QuestionRow
          selectedQuestionIndex={selectedQuestionIndex}
          setSelectedQuestionIndex={setSelectedQuestionIndex}
        ></QuestionRow>
      </ScrollArea>
      <div className="relative w-full max-w-3xl flex-col px-4 pt-10">
        <div className=" mx-auto rounded-md border px-16 py-4 ">
          <CreateQuestionForm
            surveyId={survey.id}
            question={selectedQuestion}
            setTags={setTags}
            nextQuestionIndex={questions.length}
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
