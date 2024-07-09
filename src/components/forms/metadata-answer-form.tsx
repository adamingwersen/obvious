"use client";

import {
  type FormSchema,
  getFieldRules,
} from "@/components/forms/schemas/metadata-answer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormDescription,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { type MetadataQuestionWithRespondentAnswer } from "@/types/metadata";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

// TODO: Restrict on types and render form fields accordingly

type MetadataAnswerFormProps = {
  metadataQuestions: MetadataQuestionWithRespondentAnswer[];
  surveyId: number;
  respondentUserId: number;
  handleSubmitMetadataAnswer: (
    surveyId: number,
    respondentUserId: number,
    data: FormSchema,
  ) => Promise<void>;
};

const MetadataAnswerForm = ({
  metadataQuestions,
  surveyId,
  respondentUserId,
  handleSubmitMetadataAnswer,
}: MetadataAnswerFormProps) => {
  const router = useRouter();

  const existingValues = metadataQuestions.map((mq) => {
    return {
      metadataAnswerId: mq.answer?.id,
      questionId: mq.id,
      question: mq.title,
      fieldType: mq.metadataType,
      value: mq.answer?.response ?? "",
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormSchema>({
    values: { fields: existingValues, isTocChecked: false },
  });

  const onSubmit = async (data: FormSchema) => {
    setIsLoading(true);
    await handleSubmitMetadataAnswer(surveyId, respondentUserId, data);
    setIsLoading(false);
    router.push("/respond/identified/survey");
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col items-center pt-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex w-2/3 flex-col gap-2">
          {metadataQuestions.map((mq, index) => {
            return (
              <FormField
                key={index}
                control={form.control}
                rules={getFieldRules(mq.metadataType)}
                name={`fields.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{mq.title}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Insert ${mq.metadataType.toLowerCase()}`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
          <div className="start-0 flex flex-row items-center justify-between">
            <FormField
              control={form.control}
              name="isTocChecked"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0   p-4">
                  <FormControl>
                    <Checkbox
                      required={true}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="">
                    <FormDescription>
                      {"I accept the "}
                      <Link
                        className="underline hover:text-nightsky-600"
                        href="https://www.obvious.earth"
                      >
                        terms and conditions
                      </Link>
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" isLoading={isLoading} className="">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default MetadataAnswerForm;
