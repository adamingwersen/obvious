"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormFieldTextArea } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { deleteFilesFromAnswer, upsertAnswerFromForm } from "../actions";
import { ArrowRight, File, Trash } from "lucide-react";

import FilePicker from "./FilePicker";
import Spinner from "@/components/ui/spinner";

const formSchema = z.object({
  content: z.string().min(10),
});

type AnswerStepProps = {
  stepIndex: number;
  question: {
    id: number;
    content: string;
    existingAnswer: {
      id: number;
      content: string;
      filePaths: string[];
    } | null;
  };
  nextFunc: () => void;
  backFunc: () => void;
};

export type CreateAnswerFormFields = z.infer<typeof formSchema>;

const AnswerStep = ({
  stepIndex,
  question,
  nextFunc,
  backFunc,
}: AnswerStepProps) => {
  const existingAnswer = question.existingAnswer;

  // File states
  const [answerFiles, setAnswerFiles] = useState<File[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<{ [key: number]: boolean }>(
    {},
  );

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<CreateAnswerFormFields>({
    resolver: zodResolver(formSchema),
    values: {
      content: question.existingAnswer?.content || "",
    },
  });

  const handleBack = () => {
    setIsLoading(true);
    backFunc();
    setIsLoading(false);
  };

  const handleSubmit = async (data: CreateAnswerFormFields) => {
    setIsLoading(true);

    // Only plain objects, and a few built-ins, can be passed to Server Actions.
    // Classes or null prototypes are not supported.
    // So in order to pass Files we do it through FormData
    const fd = new FormData();
    fd.append("content", data.content);
    fd.append("questionId", question.id.toString());
    fd.append("answerId", existingAnswer?.id?.toString() || "");
    answerFiles.forEach((file) => fd.append("files", file));

    await upsertAnswerFromForm(fd);

    setAnswerFiles([]);
    nextFunc();
    setIsLoading(false);
  };

  const handleDeleteFile = async (index: number) => {
    if (existingAnswer === null) {
      console.error("You cant delete file without an answer?!?");
      return;
    }
    const filePaths = existingAnswer.filePaths ?? [];
    if (filePaths.length <= index) {
      console.error("Cant find answer path");
      return;
    }
    const filePath = filePaths[index] ?? null;
    if (filePath === null) {
      console.error("Cant find entry with index in doc paths");
      return;
    }

    // Show file processing
    setLoadingFiles((prev) => ({ ...prev, [index]: true }));
    await deleteFilesFromAnswer([filePath], existingAnswer.id);
    setLoadingFiles((prev) => ({ ...prev, [index]: false }));
  };

  return (
    <div className="w-full">
      <div className="p-5">
        <h1 className="text-center text-xl font-extrabold tracking-tight">
          {question.content}
        </h1>
      </div>
      <div className="mx-auto flex flex-col items-center gap-6">
        <Form {...form}>
          <form
            className="flex w-1/4 flex-col gap-4 "
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormFieldTextArea placeholder="Your answer..." {...field} />
              )}
            />

            {(existingAnswer?.filePaths ?? []).length > 0 && (
              <div>
                Existing documents
                <div className="flex flex-col gap-2">
                  {existingAnswer?.filePaths?.map((p, index) => {
                    return (
                      <div
                        key={p}
                        className="flex items-center justify-between rounded border p-2"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <File size={15}></File>
                          <p className="text-lg">{p}</p>
                        </div>
                        <button
                          className="flex h-10 w-10 items-center justify-center"
                          onClick={() => {
                            handleDeleteFile(index);
                          }}
                          type="button"
                        >
                          {loadingFiles[index] ? (
                            <Spinner className="size-15"></Spinner>
                          ) : (
                            <Trash size={15}></Trash>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <FilePicker
              files={answerFiles}
              setFiles={setAnswerFiles}
            ></FilePicker>
            <div className="flex flex-row justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
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
    </div>
  );
};

export default AnswerStep;
