"use client";

import {
  metadataAnswerFormSchema,
  type CreateMetadataAnswerFormFields,
} from "@/components/forms/schemas/metadata-answer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormFieldInput,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  type MetadataType,
  type MetadataQuestionModel,
  type SurveyRespondentModel,
} from "@/server/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

// TODO: Restrict on types and render form fields accordingly

type MetadataAnswerFormProps = {
  surveyUuid: string;
  respondent: SurveyRespondentModel;
  metadataQuestions: MetadataQuestionModel[];
  handleSubmitMetadataAnswer: (
    surveyUuid: string,
    respondentUserId: number,
    data: CreateMetadataAnswerFormFields,
  ) => Promise<void>;
};

const MetadataAnswerForm = ({
  metadataQuestions,
  surveyUuid,
  respondent,
  handleSubmitMetadataAnswer,
}: MetadataAnswerFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<CreateMetadataAnswerFormFields>({
    resolver: zodResolver(metadataAnswerFormSchema),
  });

  const onSubmit = async (data: CreateMetadataAnswerFormFields) => {
    setIsLoading(true);
    await handleSubmitMetadataAnswer(
      surveyUuid,
      respondent.respondentUserId,
      data,
    );
    setIsLoading(false);
  };

  const setQuestionData = (
    index: number,
    questionId: number,
    metadataType: MetadataType,
  ) => {
    form.setValue(`data.${index}.questionId`, questionId);
    form.setValue(`data.${index}.metadataType`, metadataType);
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col items-center pt-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex w-2/3 flex-col gap-2">
          {metadataQuestions.map((question, index) => {
            return (
              <div key={index}>
                <FormField
                  control={form.control}
                  name={`data.${index}.response`}
                  render={({ field }) => (
                    <FormFieldInput
                      placeholder={question.title}
                      {...field}
                      onInput={() =>
                        setQuestionData(
                          index,
                          question.id,
                          question.metadataType,
                        )
                      }
                    />
                  )}
                />
              </div>
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
                      I accept the{" "}
                      <Link
                        className="underline hover:text-nightsky-600"
                        href="www.obvious.earth"
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
