"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormFieldInput,
  FormFieldTextArea,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import {
  type CreateQuestionFormFields,
  formSchema,
} from "@/components/forms/schemas/create-question";
import { Badge } from "../ui/badge";
import { type ESRSTags } from "../question/create-question-view";
import { useQuestionActions } from "@/hooks/server-actions/questions";
import { type QuestionModel } from "@/server/db/schema";

type CreateQuestionFormProps = {
  question: QuestionModel | null;
  surveyId: number;
  tags: ESRSTags;
  resetTags: () => void;
};

const CreateQuestionForm = ({
  question,
  surveyId,
  tags,
  resetTags,
}: CreateQuestionFormProps) => {
  const { upsertQuestion } = useQuestionActions();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateQuestionFormFields>({
    resolver: zodResolver(formSchema),
    values: {
      title: question?.title ?? "",
      content: question?.content ?? "",
    },
  });

  const onAddQuestion = async (data: CreateQuestionFormFields) => {
    setIsLoading(true);
    const qId = question?.id;
    const fullData = {
      surveyId,
      id: qId,
      topicTag: tags.topic ?? null,
      disclosureRequirementTag: tags.disclosureRequirement ?? null,
      datapointTag: tags.datapoint ?? null,
      dataType: tags.dataType?.xbrlDataType ?? null,
      dataUnit: tags.dataType?.unit ?? null,
      ...data,
    };

    await upsertQuestion(fullData);
    // We are creating a new question, move on to create another one
    if (!qId) {
      form.reset();
      resetTags();
    }

    setIsLoading(false);
  };

  return (
    <div className="mx-auto flex w-full flex-col items-center gap-6">
      <Form {...form}>
        <form className="flex w-full flex-col gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormFieldInput
                  type="text"
                  placeholder="Question.."
                  {...field}
                  // @ts-expect-error Removes an error in the console
                  ref={null}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormFieldTextArea
                  placeholder="Make it precise.."
                  {...field}
                  // @ts-expect-error Removes an error in the console
                  ref={null}
                />
              </FormItem>
            )}
          />
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-center font-extralight">Question tags</h1>
            <div className="mx-auto flex space-x-2">
              {tags.topic && (
                <Badge className="whitespace-nowrap bg-nightsky-700">
                  {tags.topic}
                </Badge>
              )}
              {tags.disclosureRequirement && (
                <Badge className="whitespace-nowrap bg-nightsky-500">
                  {tags.disclosureRequirement}
                </Badge>
              )}
              {tags.datapoint && (
                <Badge className="whitespace-nowrap bg-aquamarine-400">
                  {tags.datapoint}
                </Badge>
              )}
              {tags.dataType && tags.dataType.xbrlDataType != "None" && (
                <Badge className="whitespace-nowrap bg-sand-200">
                  {tags.dataType.displayName}
                  {tags.dataType.unit ? ` : ${tags.dataType.unit}` : ""}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-row justify-center">
            <Button
              variant="outline"
              isLoading={isLoading}
              onClick={form.handleSubmit((data) => onAddQuestion(data))}
            >
              Save question
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateQuestionForm;
