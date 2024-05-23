"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AnswerStep from "./AnswerStep";

type AnswerStepperProps = {
  questions: {
    id: number;
    content: string;
    existingAnswer: {
      id: number;
      content: string;
      filePaths: string[];
    } | null;
  }[];
};

const AnswerStepper = ({ questions }: AnswerStepperProps) => {
  const [answerIndex, setAnswerIndex] = useState(0);
  const router = useRouter();
  const currentQuestion = questions[answerIndex] || null;

  const questionsLength = questions.length;

  const Back = () => {
    if (answerIndex > 0) {
      setAnswerIndex((prev) => prev - 1);
    }
  };

  const Next = () => {
    const newIdx = answerIndex + 1;
    if (newIdx < questionsLength) {
      setAnswerIndex((prev) => prev + 1);
    } else if (newIdx == questionsLength) {
      router.push("/survey");
    }

    // setAnswerIndex((prev) => {
    //   const newIdx = prev + 1;
    //   console.log(newIdx, questionsLength);
    //   if (newIdx <= questionsLength) {
    //     return newIdx;
    //   } else if (newIdx == questionsLength) {
    //     // TODO: Take to some review page
    //           }
    //   return newIdx;
    // });
  };

  return (
    <div>
      {currentQuestion && (
        <div className="mx-auto flex flex-col items-center gap-6">
          <AnswerStep
            stepIndex={answerIndex}
            question={currentQuestion}
            nextFunc={Next}
            backFunc={Back}
          ></AnswerStep>
        </div>
      )}
    </div>
  );
};

export default AnswerStepper;
