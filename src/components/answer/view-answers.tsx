"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { type RespondentModel } from "@/server/db/schema";
import { type QuestionWithAnswers } from "@/types/question";
import { DownloadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "../ui/spinner";
import DynamicFileIcon from "../files/file-icon";

type ViewAnswersProps = {
  questions: QuestionWithAnswers[];
  respondents: RespondentModel[];
  handleCreateDownloadLink: (
    filePath: string,
    answerId: number,
  ) => Promise<string>;
};

const ViewAnswers = ({
  questions,
  respondents,
  handleCreateDownloadLink,
}: ViewAnswersProps) => {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState<Record<string, boolean>>(
    {},
  );
  const respondentLookup: Record<number, RespondentModel> = respondents.reduce(
    (acc, res) => {
      acc[res.id] = res;
      return acc;
    },
    {} as Record<number, RespondentModel>,
  );

  const onDownloadFileClicked = async (fileUrl: string, answerId: number) => {
    setIsDownloading((prev) => ({ ...prev, [fileUrl]: true }));
    const downloadUrl = await handleCreateDownloadLink(fileUrl, answerId);
    setIsDownloading((prev) => ({ ...prev, [fileUrl]: false }));
    router.push(downloadUrl);
  };

  return (
    <Accordion type="multiple" className="w-full">
      {questions.map((question, i) => {
        return (
          <AccordionItem value={`item-${i}`} key={`item-${i}`}>
            <AccordionTrigger>
              <div className="flex w-full items-center justify-between gap-2 p-2">
                <p className="text-left text-sm">{question.content}</p>
                <p className="whitespace-nowrap text-xs font-light">
                  {question.answers.length}{" "}
                  {question.answers.length > 1 ? "answers" : "answer"}
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {question.answers.map((a) => {
                return (
                  <div
                    key={a.id}
                    className="grid grid-cols-3 gap-4 rounded-md border border-gray-200 p-2 text-left text-sm"
                  >
                    <div>
                      Created by: {respondentLookup[a.createdById]?.email}
                    </div>
                    <div>
                      <span>Created at: </span>
                      <span className="font-extralight">
                        {a.createdAt?.toDateString()}
                      </span>
                    </div>
                    <div>Attachments</div>
                    <div className="col-span-2 font-extralight">
                      {a.content}
                    </div>
                    <div className="flex flex-col gap-1">
                      {a.documentUrls && a.documentUrls.length > 0 && a.id ? (
                        a.documentUrls.map((url) => {
                          return (
                            <div
                              key={url}
                              className="flex items-center justify-between rounded-lg border px-2 py-1"
                            >
                              <div className="flex items-center gap-1">
                                <DynamicFileIcon filename={url} size={15} />
                                <p className="text-xs font-extralight">{url}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={isDownloading[url]}
                                onClick={async () => {
                                  if (!a.id) return;
                                  await onDownloadFileClicked(url, a.id);
                                }}
                              >
                                {isDownloading[url] ? (
                                  <Spinner className="size-3"></Spinner>
                                ) : (
                                  <DownloadCloud size={12}></DownloadCloud>
                                )}
                              </Button>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs font-extralight">No files</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default ViewAnswers;
