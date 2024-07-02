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
import { useEffect, useState } from "react";

import {
  type upsertQuestionType,
  formSchema,
} from "@/components/forms/schemas/create-question";
import { Badge } from "../ui/badge";
import { type ESRSTags } from "../question/create-question-view";
import { getEsrsDataType } from "@/types/esrs/esrs-data";

type CreateQuestionFormProps = {
  question: upsertQuestionType;
  surveyId: number;
  nextQuestionIndex: number;
  saveQuestion: (question: upsertQuestionType) => Promise<void>;
  setTags: React.Dispatch<React.SetStateAction<ESRSTags>>;
  tags: ESRSTags;
};

const CreateQuestionForm = ({
  question,
  surveyId,
  nextQuestionIndex,
  setTags,
  tags,
}: CreateQuestionFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<upsertQuestionType>({
    resolver: zodResolver(formSchema),
    values:
      question !== null
        ? { title: question.title, content: question.content }
        : {
            title: "",
            content: "",
          },
  });

  const onAddQuestion = async (formData: upsertQuestionType) => {
    setIsLoading(true);

    const fullData = {
      surveyId,
      id: question?.id ?? undefined,
      topicTag: tags.topic ?? null,
      disclosureRequirementTag: tags.disclosureRequirement ?? null,
      datapointTag: tags.datapoint ?? null,
      dataType: tags.dataType?.xbrlDataType ?? null,
      dataUnit: tags.dataType?.unit ?? null,
      surveyIndex: question?.surveyIndex ?? nextQuestionIndex,
      ...formData,
    };

    await upsertQuestion(fullData);
    form.reset();
    setTags({});
    setIsLoading(false);
  };

  useEffect(() => {
    setTags({
      topic: question?.topicTag ?? undefined,
      disclosureRequirement: question?.disclosureRequirementTag ?? undefined,
      datapoint: question?.datapointTag ?? undefined,
      dataType: getEsrsDataType(
        question?.dataType ?? null,
        question?.dataUnit ?? null,
      ),
    });
  }, [question, setTags]);

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
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-row justify-end">
            <Button
              variant="default"
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
