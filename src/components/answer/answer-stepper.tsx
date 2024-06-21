"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AnswerStepForm from "@/components/forms/answer-step-form";
import { type Question } from "@/types/question";
import { type handleUpsertAnswerParams } from "@/server/actions/answer/actions";

type AnswerStepperProps = {
  questions: Question[];
  handleUpsertAnswer: (params: handleUpsertAnswerParams) => Promise<number>;
  handleTranslate: (
    content: string,
    targetLangName: string,
  ) => Promise<{ translation: string }>;
};

const AnswerStepper = ({
  questions,
  handleUpsertAnswer,
  handleTranslate,
}: AnswerStepperProps) => {
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
      router.push("/respond/identified/survey/validate");
    }
  };

  return (
    <div>
      {currentQuestion && (
        <div className="mx-auto flex flex-col items-center gap-6">
          <AnswerStepForm
            stepIndex={answerIndex}
            question={currentQuestion}
            nextFunc={Next}
            backFunc={Back}
            handleUpsertAnswer={handleUpsertAnswer}
            handleTranslate={handleTranslate}
          ></AnswerStepForm>
        </div>
      )}
    </div>
  );
};

export default AnswerStepper;
