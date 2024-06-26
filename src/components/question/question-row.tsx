"use client";

import { Separator } from "@/components/ui/separator";
import useUrlHelpers from "@/hooks/useUrlHelpers";
import { cn } from "@/lib/utils";
import { type QuestionModel } from "@/server/db/schema";
import { PencilIcon, Plus, Trash, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

type QuestionRowProps = {
  surveyUuid: string;
  question?: QuestionModel;
  handleDeleteQuestion?: (questionId: number) => Promise<void>;
};

const QuestionRow = ({
  surveyUuid,
  question,
  handleDeleteQuestion,
}: QuestionRowProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questionId = Number(searchParams.get("questionId"));

  const { getNewUrlParams } = useUrlHelpers();
  if (!question || !handleDeleteQuestion) {
    return (
      <>
        <div className="flex w-full items-center justify-center gap-2 bg-aquamarine-400 px-1 py-2">
          <Button
            className="flex items-center gap-2"
            variant="ghost"
            onClick={() => {
              router.push(`/survey/${surveyUuid}/create`);
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
              await handleDeleteQuestion(question.id);
            }}
          />
        </Button>
      </div>
      <Separator className="" />
    </>
  );
};

export default QuestionRow;
