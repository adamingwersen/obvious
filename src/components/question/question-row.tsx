"use client";

import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import { type QuestionModel } from "@/server/db/schema";
import { Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useQuestionActions } from "@/hooks/server-actions/questions";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useState } from "react";
import Spinner from "../ui/spinner";

type QuestionRowProps = {
  question?: QuestionModel;
  isSelected: boolean;
  selectQuestion: () => void;
};

const QuestionRow = ({
  question,
  isSelected,
  selectQuestion,
}: QuestionRowProps) => {
  const { deleteQuestion } = useQuestionActions();

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [dialogQuestionId, setDialogQuestionID] = useState<number>();

  const onDeleteQuestion = async (questionId: number) => {
    setIsDeleting(true);
    try {
      await deleteQuestion(questionId, false);
    } catch (error) {
      setDialogQuestionID(questionId);
      setConfirmDialogOpen(true);
    }
    setIsDeleting(false);
  };

  const onOpenDialogChange = async (confirmed: boolean) => {
    if (confirmed) {
      if (!dialogQuestionId)
        throw new Error(
          "Silly programmer, you need to set questionId before doing this",
        );
      setIsDeleting(true);
      await deleteQuestion(dialogQuestionId, true);
      setIsDeleting(false);
    }
    setDialogQuestionID(undefined);
  };

  if (!question) {
    return (
      <>
        <div className="flex w-full items-center justify-center gap-2 bg-aquamarine-400 py-4">
          <button
            className="flex h-full w-full items-center justify-center gap-2 text-sm font-light"
            onClick={() => {
              selectQuestion();
            }}
          >
            <Plus size={16} />
            Add new question
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between gap-2 px-1 py-2",
          isSelected && " bg-gray-200",
        )}
      >
        <button
          onClick={() => {
            if (!isSelected) {
              selectQuestion();
            }
          }}
          className="flex-grow p-1 text-left text-sm"
        >
          {question.title}
        </button>
        <div className="flex-shrink-0">
          <Button
            variant="outline"
            size="icon"
            onClick={async () => {
              if (!question.id) return;
              await onDeleteQuestion(question.id);
            }}
          >
            {isDeleting ? <Spinner /> : <Trash size={14} />}
          </Button>
        </div>
      </div>
      <Separator className="" />
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
    </>
  );
};

export default QuestionRow;
