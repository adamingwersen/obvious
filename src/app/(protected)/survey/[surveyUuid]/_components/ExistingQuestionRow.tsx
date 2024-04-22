"use client";

import { handleRemoveQuestion } from "@/app/(protected)/survey/[surveyUuid]/actions";
import { Separator } from "@/components/ui/separator";
import useUrlHelpers from "@/hooks/useUrlHelpers";
import { type QuestionModel } from "@/server/db/schema";
import { PencilIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";

type ExistingQuestionRowProps = {
  question: QuestionModel;
};

const ExistingQuestionRow = ({ question }: ExistingQuestionRowProps) => {
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
            onClick={() => {
              void handleRemoveQuestion(question.id);
            }}
          />
        </div>
      </div>
      <Separator className="my-2" />
    </>
  );
};

export default ExistingQuestionRow;
