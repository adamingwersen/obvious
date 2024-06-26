"use client";

import { Separator } from "@/components/ui/separator";
import useUrlHelpers from "@/hooks/useUrlHelpers";
import { cn } from "@/lib/utils";
import { type QuestionModel } from "@/server/db/schema";
import { PencilIcon, Plus, Trash, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { useQuestionActions } from "@/hooks/server-actions/questions";

type QuestionRowProps = {
  surveyUuid: string;
  question?: QuestionModel;
};

const QuestionRow = ({ surveyUuid, question }: QuestionRowProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { removeQueryParam } = useUrlHelpers();
  const { deleteQuestion } = useQuestionActions();

  const questionId = Number(searchParams.get("questionId"));

  const { getNewUrlParams } = useUrlHelpers();
  if (!question) {
    return (
      <>
        <div className="flex w-full items-center justify-center gap-2 bg-aquamarine-400 px-1 py-2">
          <Button
            className="flex items-center gap-2"
            variant="ghost"
            onClick={() => {
              router.replace(removeQueryParam("questionId"));
              // router.refresh();
            }}
          >
            <Plus size={16} />
            Add new question
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between gap-2 px-1 py-2",
          question.id === questionId && " bg-gray-200",
        )}
      >
        <button
          onClick={() => {
            if (questionId !== question.id) {
              router.push(getNewUrlParams(`questionId=${question.id}`));
            }
          }}
          className="flex-grow p-1 text-left text-sm"
        >
          {question.title}
        </button>
        <Button variant="ghost" size="icon">
          <Trash
            size={16}
            onClick={async () => {
              await deleteQuestion(question.id);
            }}
          />
        </Button>
      </div>
      <Separator className="" />
    </>
  );
};

export default QuestionRow;
