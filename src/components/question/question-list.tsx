import update from "immutability-helper";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";

import { QuestionModel } from "@/server/db/schema/question.schema.js";
import { DraggableQuestionRow } from "./question-row";
import {
  type upsertQuestionsType,
  type upsertQuestionType,
} from "../forms/schemas/create-question";

type QuestionListProps = {
  questions: upsertQuestionType[];
  selectedQuestionIndex: number | null;
  setQuestions: React.Dispatch<React.SetStateAction<upsertQuestionType[]>>;
  setSelectedQuestionIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export const QuestionList: FC<QuestionListProps> = ({
  questions,
  setQuestions,
  selectedQuestionIndex,
  setSelectedQuestionIndex,
}) => {
  {
    const moveQuestion = useCallback(
      (dragIndex: number, hoverIndex: number) => {
        console.log(dragIndex, hoverIndex);
        setQuestions((prevQuestions: upsertQuestionsType) => {
          return update(prevQuestions, {
            $splice: [
              [dragIndex, 1],
              // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
              [hoverIndex, 0, prevQuestions[dragIndex] as upsertQuestionType],
            ],
          }).map((q, i) => {
            return {
              ...q,
              surveyIndex: i,
            };
          });
        });
      },
      [setQuestions],
    );

    const renderQuestion = useCallback(
      (question: QuestionModel, index: number) => {
        return (
          <DraggableQuestionRow
            key={question.id}
            index={index}
            question={question}
            moveRow={moveQuestion}
            selectedQuestionIndex={selectedQuestionIndex}
            setSelectedQuestionIndex={setSelectedQuestionIndex}
          />
        );
      },
      [selectedQuestionIndex],
    );

    return (
      <>
        <div>{questions.map((q, i) => renderQuestion(q, i))}</div>
      </>
    );
  }
};
