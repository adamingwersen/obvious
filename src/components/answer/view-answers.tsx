"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { type UserModel } from "@/server/db/schema";
import { type QuestionWithAnswers } from "@/types/question";
import { FoldVerticalIcon, UnfoldVerticalIcon } from "lucide-react";
import { useState } from "react";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import FileDisplayComponent from "@/components/files/file-display";

type ViewAnswersProps = {
  asOriginator: boolean;
  questions: QuestionWithAnswers[];
  respondents: UserModel[];
};

const ViewAnswers = ({
  asOriginator,
  questions,
  respondents,
}: ViewAnswersProps) => {
  const [openElements, setOpenElements] = useState<string[]>([]);
  console.log(questions);
  const respondentLookup: Record<number, UserModel> = respondents.reduce(
    (acc, res) => {
      acc[res.id] = res;
      return acc;
    },
    {} as Record<number, UserModel>,
  );

  const onAccordionValueChange = (elements: string[]) => {
    setOpenElements(elements);
  };

  const onToggleOpenClose = () => {
    if (openElements.length > 0) {
      setOpenElements([]);
    } else {
      setOpenElements(questions.map((_, i) => `item-${i}`));
    }
  };

  return (
    <div className="h-full">
      <div className="flex max-h-full flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="font-extralight">Questions</h1>
          <Button
            variant="outline"
            shape={asOriginator ? "default" : "boxy"}
            onClick={onToggleOpenClose}
          >
            {openElements.length === 0 ? (
              <div className="flex items-center gap-2">
                <UnfoldVerticalIcon size={15}></UnfoldVerticalIcon>
                <p>Expand all</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FoldVerticalIcon size={15}></FoldVerticalIcon>
                <p>Collapse all</p>
              </div>
            )}
          </Button>
        </div>
        <ScrollArea className="max-h-5/6 overflow-y-auto border">
          <Accordion
            type="multiple"
            value={openElements}
            onValueChange={onAccordionValueChange}
          >
            {questions.map((question, i) => {
              return (
                <AccordionItem
                  value={`item-${i}`}
                  key={`item-${i}`}
                  className="p-3"
                >
                  <AccordionTrigger>
                    <div className="flex w-full items-center justify-between gap-2 p-2">
                      <p className="text-left text-sm">{question.content}</p>
                      <p className="whitespace-nowrap text-xs font-light">
                        {asOriginator
                          ? question.answers.length > 1
                            ? `${question.answers.length} answers`
                            : `${question.answers.length} answer`
                          : " "}
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
                          {asOriginator ? (
                            <div>
                              Created by:{" "}
                              {respondentLookup[a.createdById]?.email}
                            </div>
                          ) : (
                            <div>Your answer</div>
                          )}

                          <div>
                            <span>Created at: </span>
                            <span className="font-extralight">
                              {a.createdAt?.toDateString()}
                            </span>
                          </div>
                          <div>Attachments</div>
                          <div className="col-span-2 whitespace-pre-wrap font-extralight">
                            {a.content}
                          </div>
                          <div className="flex flex-col gap-1">
                            {a.documentUrls &&
                            a.documentUrls.length > 0 &&
                            a.id ? (
                              a.documentUrls.map((filePath, i) => {
                                return (
                                  <FileDisplayComponent
                                    key={i}
                                    fileName={filePath}
                                    answerId={a.id}
                                  ></FileDisplayComponent>
                                );
                              })
                            ) : (
                              <p className="text-xs font-extralight">
                                No files
                              </p>
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
        </ScrollArea>
      </div>
    </div>
  );
};

export default ViewAnswers;
