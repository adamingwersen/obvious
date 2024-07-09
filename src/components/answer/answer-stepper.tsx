"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AnswerStepForm from "@/components/forms/answer-step-form";
import { type QuestionWithRespondentAnswer } from "@/types/question";
import { Progress } from "../ui/progress";

type AnswerStepperProps = {
  questions: QuestionWithRespondentAnswer[];
  handleTranslate: (
    content: string,
    targetLangName: string,
  ) => Promise<{ translation: string }>;
};

const AnswerStepper = ({ questions, handleTranslate }: AnswerStepperProps) => {
  const searchParams = useSearchParams();
  const questionsLength = questions.length;
  const startIndexParam = searchParams.get("startIndex");
  let startIndex = parseInt(startIndexParam ?? "-1");

  if (isNaN(startIndex) || startIndex < 0 || startIndex >= questionsLength) {
    startIndex = 0;
  }
  const [answerIndex, setAnswerIndex] = useState(startIndex);
  const [progress, setProgress] = useState<number>(
    answerIndex === 0 ? 0 : (answerIndex / questionsLength) * 100,
  );
  const router = useRouter();
  const currentQuestion = questions[answerIndex] ?? null;

  const Back = () => {
    if (answerIndex > 0) {
      setAnswerIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    setProgress((answerIndex / questionsLength) * 100);
  }, [questionsLength, answerIndex]);

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
      <Progress value={progress} />
      {currentQuestion && (
        <div className="mx-auto flex flex-col items-center gap-6">
          <AnswerStepForm
            stepIndex={answerIndex}
            question={currentQuestion}
            nextFunc={Next}
            backFunc={Back}
            handleTranslate={handleTranslate}
          ></AnswerStepForm>
        </div>
      )}
    </div>
  );
};

export default AnswerStepper;
