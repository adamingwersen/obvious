"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormFieldInput,
  FormFieldTextArea,
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

type CreateQuestionFormProps = {
  surveyId: number;
  handleUpsertQuestion: (
    data: CreateQuestionFormFields,
    surveyId: number,
    questionId: number,
  ) => Promise<void>;
};

const CreateQuestionForm = ({
  surveyId,
  handleUpsertQuestion,
}: CreateQuestionFormProps) => {
  const router = useRouter();
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

  const form = useForm<CreateQuestionFormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onAddQuestion = async (data: CreateQuestionFormFields) => {
    setIsLoading(true);
    await handleUpsertQuestion(data, surveyId, Number(questionId));
    form.reset();
    router.replace(removeQueryParam("questionId"));
    router.refresh();
    setIsLoading(false);
  };

  useEffect(() => {
    if (!data) return;

    form.setValue("title", data.title);
    form.setValue("content", data.content);
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
    <div className="mx-auto flex flex-col items-center gap-6">
      <Form {...form}>
        <form className="flex w-1/4 flex-col gap-4">
          <FormField
            control={form.control}
            name="title"
            defaultValue={data ? data.title : undefined}
            render={({ field }) => (
              <FormFieldInput
                type="text"
                placeholder="Question title..."
                {...field}
              />
            )}
          />
          <FormField
            control={form.control}
            name="content"
            defaultValue={data ? data.content : undefined}
            render={({ field }) => (
              <FormFieldTextArea placeholder="Make it precise.." {...field} />
            )}
          />
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
