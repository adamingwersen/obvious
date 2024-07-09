"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AnswerStepForm from "@/components/forms/answer-step-form";
import { type QuestionWithRespondentAnswer } from "@/types/question";
import { Progress } from "../ui/progress";
import { answer } from "@/server/db/schema";
import Spinner from "../ui/spinner";

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
    if (questionsLength === answerIndex)
      router.push("/respond/identified/survey/validate");
  }, [questionsLength, answerIndex, router]);

  const Next = () => {
    setAnswerIndex((prev) => {
      const newIdx = prev + 1;
      if (newIdx > questionsLength) {
        return prev;
      }
      return newIdx;
    });
  };

  return (
    <div className="h-full">
      <Progress value={progress} className="h-2" />
      {currentQuestion ? (
        <div className="mx-auto flex h-full flex-col items-center gap-6">
          <AnswerStepForm
            stepIndex={answerIndex}
            question={currentQuestion}
            nextFunc={Next}
            backFunc={Back}
            handleTranslate={handleTranslate}
          ></AnswerStepForm>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <Spinner className="size-10" />
        </div>
      )}
    </div>
  );
};

export default AnswerStepper;
