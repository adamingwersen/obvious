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
import { api } from "@/trpc/react";

import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/ui/spinner";
import useUrlHelpers from "@/hooks/useUrlHelpers";
import {
  type CreateQuestionFormFields,
  formSchema,
} from "@/components/forms/schemas/create-question";
import { Badge } from "../ui/badge";
import { ESRSTags } from "../question/create-question-view";
import { useQuestionActions } from "@/hooks/server-actions/questions";
import { getEsrsDataType } from "@/types/esrs/esrs-data";

type CreateQuestionFormProps = {
  surveyId: number;
  setTags: (tag: ESRSTags) => void;
  tags: ESRSTags;
};

const CreateQuestionForm = ({
  surveyId,
  setTags,
  tags,
}: CreateQuestionFormProps) => {
  const router = useRouter();

  const { upsertQuestion } = useQuestionActions();

  const searchParams = useSearchParams();
  const { removeQueryParam } = useUrlHelpers();
  const questionId = searchParams.get("questionId");
  const [isLoading, setIsLoading] = useState(false);

  const {
    data,
    error,
    isLoading: isQueryLoading,
  } = api.question.findById.useQuery(
    {
      id: Number(questionId),
    },
    { enabled: !!questionId },
  );

  useEffect(() => {
    if (!searchParams.has("questionId")) {
      form.reset();
      setTags({});
    }
  }, [searchParams]);

  const form = useForm<CreateQuestionFormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onAddQuestion = async (data: CreateQuestionFormFields) => {
    questionId;
    setIsLoading(true);
    const qId = questionId ? Number(questionId) : undefined;

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
    console.log(fullData);
    await upsertQuestion(fullData);
    form.reset();
    router.replace(removeQueryParam("questionId"));
    router.refresh();
    setTags({});
    setIsLoading(false);
  };

  useEffect(() => {
    if (!data) return;
    form.setValue("title", data.title);
    form.setValue("content", data.content);
    setTags({
      topic: data.topicTag ?? undefined,
      disclosureRequirement: data.disclosureRequirementTag ?? undefined,
      datapoint: data.datapointTag ?? undefined,
      dataType: getEsrsDataType(data.dataType, data.dataUnit),
    });
  }, [data, form]);

  if (isQueryLoading && !data) {
    return (
      <div className="mx-auto flex flex-col items-center gap-6">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (error) throw new Error(error.message);

  return (
    <div className="mx-auto flex w-full flex-col items-center gap-6">
      <Form {...form}>
        <form className="flex w-full flex-col gap-4">
          <FormField
            control={form.control}
            name="title"
            defaultValue={data ? data.title : undefined}
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
            defaultValue={data ? data.content : undefined}
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
