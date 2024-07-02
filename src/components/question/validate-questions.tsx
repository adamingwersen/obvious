"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { type QuestionModel } from "@/server/db/schema";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import Spinner from "../ui/spinner";

type ValidateQuestionsProps = {
  questions: QuestionModel[];
  handleDeleteQuestion: (
    questionId: number,
    allowCascading: boolean,
  ) => Promise<void>;
};

const ValidateQuestions = ({
  questions,
  handleDeleteQuestion,
}: ValidateQuestionsProps) => {
  const [loadingFiles, setLoadingFiles] = useState<Record<number, boolean>>({});

  const [dialogQuestionId, setDialogQuestionID] = useState<number>();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);

  const onDeleteQuestion = async (questionId: number, index: number) => {
    setLoadingFiles((prev) => ({ ...prev, [index]: true }));
    try {
      await deleteQuestion(questionId, false);
    } catch (error) {
      setDialogQuestionID(questionId);
      setConfirmDialogOpen(true);
    }
    setLoadingFiles((prev) => ({ ...prev, [index]: false }));
  };

  const deleteQuestion = async (
    questionId: number,
    cascadeAnswers: boolean,
  ) => {
    await handleDeleteQuestion(questionId, cascadeAnswers);
  };

  const onOpenDialogChange = async (confirmed: boolean) => {
    if (confirmed) {
      if (!dialogQuestionId)
        throw new Error(
          "Silly programmer, you need to set questionId before doing this",
        );
      await deleteQuestion(dialogQuestionId, true);
    }
    setDialogQuestionID(undefined);
  };

  return (
    <div>
      <h1 className="p-2">Validate your survey</h1>
      <ScrollArea className="h-full w-full rounded-md border">
        {questions.map((q, index) => (
          <>
            <div
              key={q.id}
              className={cn(
                "flex items-center justify-between px-2",
                index === 0 && "pt-1",
              )}
            >
              <div className="w-2/3">
                <p className="text-lg">{q.title}</p>
                <p key={q.id} className="text-xs">
                  {q.content}
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={async () => await onDeleteQuestion(q.id, index)}
              >
                {loadingFiles[index] ? (
                  <Spinner className="size-4"></Spinner>
                ) : (
                  <Trash size={14}></Trash>
                )}
              </Button>
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </ScrollArea>
      <AlertDialog
        open={confirmDialogOpen}
        onOpenChange={(open) => setConfirmDialogOpen(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This questions seems to have one or more answers attached to it.
              You will lose these answers if you choose to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => onOpenDialogChange(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => onOpenDialogChange(true)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ValidateQuestions;
