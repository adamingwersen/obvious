"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormFieldTextArea,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

import FilePicker from "@/components/files/file-picker";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Translator from "@/components/translate/translator";
import { type QuestionWithRespondentAnswer } from "@/types/question";
import {
  type AnswerFormData,
  getFormValationSchema,
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
import { cn, transliterateFileName } from "@/lib/utils";
import { useFiles } from "@/hooks/use-files";
import { useAnswerActions } from "@/hooks/server-actions/answers";
import { getEsrsDataType } from "@/types/esrs/esrs-data";
import { Calendar } from "../ui/calendar";

type AnswerStepFormProps = {
  stepIndex: number;
  question: QuestionWithRespondentAnswer;
  nextFunc: () => void;
  backFunc: () => void;
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
  handleTranslate,
}: AnswerStepFormProps) => {
  const answer = question.answer;
  const esrsDataType = getEsrsDataType(question.dataType, question.dataUnit);
  const { uploadFile } = useFiles();
  const { upsertAnswer, cantAnswer } = useAnswerActions();

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

  const parseDBDataToFormDataType = () => {
    const formType = esrsDataType?.formDataType;
    switch (formType) {
      case "date":
        const newDate = answer.content ? new Date(answer.content) : null;
        return {
          content: newDate,
        };
      case "number":
        return {
          content: answer.content ? parseFloat(answer.content) : "",
        };
      case "text":
        return {
          content: answer.content,
        };
      default:
        return {
          content: answer.content,
        };
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<AnswerFormData>({
    resolver: zodResolver(getFormValationSchema(esrsDataType)),
    values: parseDBDataToFormDataType(),
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
    // For some reason the value of the form seems to carry over when stepping
    // So we reset before moving back and forth
    form.reset();
    form.setValue("content", "");
    backFunc();
    setIsLoading(false);
  };
  const onSetCantAnswerClicked = async (value: boolean) => {
    setIsLoading(true);
    await cantAnswer({
      questionId: question.id,
      answerId: answer.id,
      cantAnswer: value,
    });
    // If we mark can't answer we move on otherwise we stay
    if (value) {
      form.reset();
      form.setValue("content", "");
      nextFunc();
    }
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

  const onSubmit = async (data: AnswerFormData) => {
    // Parse answer to string for db
    let answerStr = null;
    if (data.content instanceof Date) {
      answerStr = data.content.toLocaleDateString();
    } else if (typeof data.content === "number") {
      answerStr = data.content.toString();
    } else {
      answerStr = data.content ?? "";
    }

    setIsLoading(true);
    await upsertAnswer({
      content: answerStr,
      questionId: question.id,
      answerId: answer.id,
      filePaths: answerFilesPaths,
    });

    form.reset();
    form.setValue("content", "");

    setIsLoading(false);
    nextFunc();
  };

  const hasTags = (q: QuestionWithRespondentAnswer) => {
    return !(
      !q.topicTag &&
      !q.disclosureRequirementTag &&
      !q.datapointTag &&
      !q.dataType &&
      !q.dataUnit
    );
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

  const renderForm = () => {
    const formType = esrsDataType?.formDataType ?? "text";
    switch (formType) {
      case "text":
        return (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormFieldTextArea
                className="min-h-32 sm:min-h-40"
                placeholder="Your answer..."
                {...field}
                // @ts-expect-error Removes an error in the console
                ref={null}
              />
            )}
          />
        );
      case "date":
        const formType = form.getValues("content");
        if (!(formType instanceof Date)) return null;
        return (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(e) => {
                        field.onChange(e ? e : null);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "number":
        const label = esrsDataType?.unit
          ? `Number of ${esrsDataType.unit}`
          : "Provide a number";
        return (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="your answer.."
                    value={typeof field.value === "number" ? field.value : ""}
                    onChange={(e) =>
                      form.setValue("content", parseFloat(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "table":
      default:
        break;
    }
  };

  return (
    <div className="relative h-full w-full text-left">
      <div className="space-y-2 p-3">
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
        {hasTags(question) && (
          <div>
            <p className="text-sm font-extralight">ESRS tags</p>
            <div className="mx-auto flex w-full flex-wrap gap-2">
              {question.topicTag && (
                <Badge className="whitespace-nowrap bg-nightsky-700">
                  Topic: {question.topicTag}
                </Badge>
              )}
              {question.disclosureRequirementTag && (
                <Badge className="whitespace-nowrap bg-nightsky-500">
                  Disclosure requirement: {question.disclosureRequirementTag}
                </Badge>
              )}
              {question.datapointTag && (
                <Badge className="whitespace-nowrap bg-aquamarine-400">
                  Datapoint: {question.datapointTag}
                </Badge>
              )}
              {esrsDataType !== undefined && (
                <>
                  {esrsDataType.xbrlDataType != "None" && (
                    <Badge className="whitespace-nowrap bg-sand-200">
                      Requested response type: {esrsDataType.displayName}
                    </Badge>
                  )}
                  {esrsDataType.unit && (
                    <Badge className="whitespace-nowrap bg-sand-200">
                      Reporting unit: {esrsDataType.unit}
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        {answer.cantAnswer && (
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold">Marked as can not answer</p>
            <Button
              variant="ghost"
              shape="boxy"
              size="icon"
              onClick={async () => await onSetCantAnswerClicked(false)}
            >
              <X size={16}></X>
            </Button>
          </div>
        )}
      </div>
      <div className="mx-auto flex flex-col items-center gap-6">
        <Form {...form}>
          <form
            className="flex h-full w-full flex-col gap-1 xl:gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {renderForm()}
            <div className="flex flex-row justify-evenly gap-2">
              {answerFilesPaths.length > 0 && (
                <div className="text-lg font-extralight">
                  Documents
                  <div className=" flex h-24 flex-col gap-2 overflow-x-auto md:h-36">
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
              <FilePicker uploadFiles={onUploadFiles} />
            </div>

            <div className="absolute bottom-2 w-full">
              <div className="flex flex-col justify-between sm:flex-row">
                <Button
                  variant="outline"
                  shape="boxy"
                  onClick={onBack}
                  type="button"
                  disabled={stepIndex === 0}
                >
                  Back
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        onClick={async () => await onSetCantAnswerClicked(true)}
                        type="button"
                        shape="boxy"
                      >
                        {"I can't answer this"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mark the question as you can not answer it!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  className="gap-1"
                  type="submit"
                  shape="boxy"
                  variant="default"
                  disabled={isLoading}
                  isLoading={isLoading}
                >
                  Next Question
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
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
