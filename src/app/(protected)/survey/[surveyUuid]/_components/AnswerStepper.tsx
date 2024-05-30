"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AnswerStep from "./AnswerStep";
import { Question } from "../answer/page";

type AnswerStepperProps = {
  questions: Question[];
};

const AnswerStepper = ({ questions }: AnswerStepperProps) => {
  const [answerIndex, setAnswerIndex] = useState(0);
  const router = useRouter();
  const currentQuestion = questions[answerIndex] ?? null;

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
