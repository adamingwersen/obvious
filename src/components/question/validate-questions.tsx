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
import { Separator } from "../ui/separator";
import Spinner from "../ui/spinner";
import { Badge } from "../ui/badge";
import { getEsrsDataType } from "@/types/esrs/esrs-data";

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
  const esrsDataTypes = questions.map((q) => {
    return getEsrsDataType(q.dataType, q.dataUnit);
  });
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
    <div className="h-full">
      <h1 className="p-2 font-extralight">Validate your survey</h1>
      <ScrollArea className="h-5/6 w-full rounded-md border">
        {questions.map((q, index) => (
          <>
            <div key={q.id} className="flex flex-row gap-2 p-2">
              <div className="flex w-6/12 flex-col gap-1">
                <p className="font-extralight">{q.title}</p>
                <p className="text-xs">{q.content}</p>
              </div>
              <div className="flex w-5/12 flex-row flex-wrap gap-2 self-center">
                {q.topicTag && (
                  <div>
                    <Badge className="whitespace-nowrap bg-nightsky-700">
                      {q.topicTag}
                    </Badge>
                  </div>
                )}
                {q.disclosureRequirementTag && (
                  <div>
                    <Badge className="whitespace-nowrap bg-nightsky-500">
                      {q.disclosureRequirementTag}
                    </Badge>
                  </div>
                )}
                {q.datapointTag && (
                  <div>
                    <Badge className="whitespace-nowrap bg-aquamarine-400">
                      {q.datapointTag}
                    </Badge>
                  </div>
                )}
                {esrsDataTypes[index] !== undefined && (
                  <div>
                    {esrsDataTypes[index]?.xbrlDataType !== "None" && (
                      <Badge className="whitespace-nowrap bg-sand-200">
                        {esrsDataTypes[index]?.displayName}
                        {esrsDataTypes[index]?.unit
                          ? ` : ${esrsDataTypes[index]?.unit}`
                          : ""}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <div className="flex w-1/12 items-center justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={async () => await onDeleteQuestion(q.id, index)}
                >
                  {loadingFiles[index] ? (
                    <Spinner className="size-4"></Spinner>
                  ) : (
                    <Trash size={14}></Trash>
                  )}
                </Button>
              </div>
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
