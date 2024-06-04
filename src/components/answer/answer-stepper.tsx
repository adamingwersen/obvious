"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AnswerStepForm from "@/components/forms/answer-step-form";
import { type Question } from "@/types/question";

type AnswerStepperProps = {
  questions: Question[];
  handleDeleteFileFunc: (
    filePaths: string[],
    answerId: number,
  ) => Promise<void>;
  handleUpsertFileFunc: (formData: FormData) => Promise<void>;
};

const AnswerStepper = ({
  questions,
  handleDeleteFileFunc,
  handleUpsertFileFunc,
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
      router.push("/survey");
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
            handleDeleteFileFunc={handleDeleteFileFunc}
            handleUpsertFileFunc={handleUpsertFileFunc}
          ></AnswerStepForm>
        </div>
      )}
    </div>
  );
};

export default AnswerStepper;
