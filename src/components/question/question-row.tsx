"use client";

import { Separator } from "@/components/ui/separator";
import useUrlHelpers from "@/hooks/useUrlHelpers";
import { type QuestionModel } from "@/server/db/schema";
import { PencilIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";

type QuestionRowProps = {
  question: QuestionModel;
  handleDeleteQuestion: (questionId: number) => Promise<void>;
};

const QuestionRow = ({ question, handleDeleteQuestion }: QuestionRowProps) => {
  const router = useRouter();
  const { getNewUrlParams } = useUrlHelpers();
  return (
    <>
      <div
        key={question.id}
        className="flex flex-row justify-between p-1 text-sm"
      >
        {question.title}
        <div className="flex flex-row space-x-2">
          <PencilIcon
            className="size-4"
            onClick={() =>
              router.push(getNewUrlParams(`questionId=${question.id}`))
            }
          />
          <X
            className="size-4"
            onClick={async () => {
              await handleDeleteQuestion(question.id);
            }}
          />
        </div>
      </div>
      <Separator className="my-2" />
    </>
  );
};

export default QuestionRow;
