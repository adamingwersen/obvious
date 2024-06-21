"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormFieldTextArea } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

import FilePicker from "@/components/files/file-picker";

import Translator from "@/components/translate/translator";
import { type Question } from "@/types/question";
import {
  type CreateAnswerFormFields,
  formSchema,
} from "@/components/forms/schemas/answer-step";
import FileDisplayComponent, {
  type FileDisplayComponentRef,
} from "../files/file-display";
import { useToast } from "../ui/use-toast";
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
import { transliterateFileName } from "@/lib/utils";
import { useFiles } from "@/hooks/use-files";
import { type handleUpsertAnswerParams } from "@/server/actions/answer/actions";

type AnswerStepFormProps = {
  stepIndex: number;
  question: Question;
  nextFunc: () => void;
  backFunc: () => void;
  handleUpsertAnswer: (params: handleUpsertAnswerParams) => Promise<number>;
  handleTranslate: (
    content: string,
    targetLangName: string,
  ) => Promise<{ translation: string }>;
};

const AnswerStepForm = ({
  stepIndex,
  question,
  nextFunc,
  backFunc,
  handleUpsertAnswer,
  handleTranslate,
}: AnswerStepFormProps) => {
  const answer = question.existingAnswer;
  const { uploadFile } = useFiles();

  const fileRefs = useRef<Record<string, FileDisplayComponentRef | null>>({});

  const { toast } = useToast();
  // File states
  const [answerFilesPaths, setAnswerFilesPaths] = useState<string[]>(
    answer.documentUrls ?? [],
  );
  // Confirmation states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [confirmationResult, setConfirmationResult] = useState<boolean | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<CreateAnswerFormFields>({
    resolver: zodResolver(formSchema),
    values: {
      content: question.existingAnswer?.content ?? "",
    },
  });

  useEffect(() => {
    const filePaths = answer?.documentUrls ?? [];

    const newRefs: Record<string, FileDisplayComponentRef | null> = {};
    setTimeout(() => {
      filePaths.forEach((fp) => {
        const newRef = fileRefs.current[fp] ?? null;
        newRef?.updateProgress(100);
        newRefs[fp] = newRef;
      });
      fileRefs.current = newRefs;
    }, 0);

    setAnswerFilesPaths(filePaths);
  }, [answer]);

  const onBack = () => {
    setIsLoading(true);
    backFunc();
    setIsLoading(false);
  };

  const onUploadFiles = async (files: File[]) => {
    // Make filename to ASCII
    const fileNames = files.map((f) => transliterateFileName(f.name));

    const overlapping = fileNames.filter((f) => answerFilesPaths.includes(f));
    const newFileNames = fileNames.filter((f) => !overlapping.includes(f));
    if (overlapping.length > 0) {
      setConfirmDialogOpen(true);
      // Wait for user confirmation
      const result = await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (confirmationResult !== null) {
            clearInterval(interval);
            resolve(confirmationResult);
          }
        }, 100);
      });

      setConfirmationResult(null);
      if (!result) return;
    }

    setAnswerFilesPaths((prevPaths) => {
      const newPaths = [...prevPaths, ...newFileNames];
      setTimeout(() => {
        for (let idx = 0; idx < files.length; idx++) {
          const file = files[idx];
          if (!file) throw new Error("Accesing file outside of range");
          const fn = fileNames[idx];
          if (!fn) throw new Error("Cant find filename?");

          const ref = fileRefs.current[fn];
          if (!ref) {
            console.error("Missing inner ref?");
            return;
          }

          uploadFile({
            fileName: fn,
            file: file,
            answerId: answer.id,
            onProgress: (p) => {
              ref.updateProgress(p);
            },
            onError: onFileUploadError,
            onSuccess: () => ref.updateProgress(100),
          })
            .then()
            .catch((error) => {
              onFileUploadError(error as Error);
            });
        }
      }, 0);
      return newPaths;
    });
  };

  const onSubmit = async (data: CreateAnswerFormFields) => {
    setIsLoading(true);

    await handleUpsertAnswer({
      content: data.content,
      questionId: question.id,
      answerId: answer.id,
      filePaths: answerFilesPaths,
    });
    form.reset();
    setIsLoading(false);
    nextFunc();
  };

  const onFileUploadError = (error: Error) => {
    const errMsg = error.message;
    if (errMsg.includes("response code: 415")) {
      toast({ title: "File type not supported" });
    } else if (errMsg.includes("response code: 413")) {
      toast({ title: "File too big, maximum size is 50mb" });
    } else {
      toast({ title: "Something went wrong uploading file" });
      console.error(error);
    }
    setAnswerFilesPaths((prev) => {
      const newList = [...prev];
      newList.pop();
      return newList;
    });
  };

  function onOpenDialogChange(confirmed: boolean) {
    setConfirmDialogOpen(false);
    if (confirmed) {
      setConfirmationResult(true);
    } else {
      setConfirmationResult(false);
    }
  }

  return (
    <div className="w-full p-5 text-left">
      <div className="p-3">
        <p className="text-lg font-light tracking-tight">{question.title}</p>
        <Translator
          translations={question.translations}
          content={question.content}
          answerId={undefined}
          questionId={question.id}
          handleTranslate={handleTranslate}
        >
          <p className="w-full text-left text-base font-extralight tracking-tight">
            {question.content}
          </p>
        </Translator>
      </div>
      <div className="mx-auto flex flex-col items-center gap-6">
        <Form {...form}>
          <form
            className="flex w-full flex-col gap-4 "
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormFieldTextArea
                  className="min-h-40"
                  placeholder="Your answer..."
                  {...field}
                  // @ts-expect-error Removes an error in the console
                  ref={null}
                />
              )}
            />

            {answerFilesPaths.length > 0 && (
              <div className="font-medium">
                Documents
                <div className="flex flex-col gap-2">
                  {answerFilesPaths.map((f: string, index: number) => {
                    return (
                      <FileDisplayComponent
                        key={index}
                        fileName={f}
                        answerId={answer.id}
                        ref={(el) => {
                          fileRefs.current[f] = el;
                        }}
                      ></FileDisplayComponent>
                    );
                  })}
                </div>
              </div>
            )}
            <FilePicker uploadFiles={onUploadFiles}></FilePicker>
            <div className="flex flex-row justify-between">
              <Button
                variant="outline"
                onClick={onBack}
                type="button"
                disabled={stepIndex === 0}
              >
                Back
              </Button>
              <Button
                className="gap-1"
                type="submit"
                variant="default"
                disabled={isLoading}
                isLoading={isLoading}
              >
                Next Question
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <AlertDialog
        open={confirmDialogOpen}
        onOpenChange={(open) => setConfirmDialogOpen(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Overwrite existing files?</AlertDialogTitle>
            <AlertDialogDescription>
              There seem to be one or more existing files with same names. Do
              you want to overwrite?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => onOpenDialogChange(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => onOpenDialogChange(true)}>
              Overwrite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AnswerStepForm;
