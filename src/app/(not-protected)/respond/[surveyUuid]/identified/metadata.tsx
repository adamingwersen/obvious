"use client";

import { handleSubmitMetadataForm } from "./actions";
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
} from "@/server/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { METADATA_TYPES } from "@/server/db/schema";
import { z } from "zod";

// TODO: Restrict on types and render form fields accordingly
const fieldSchema = z.object({
  response: z.string().min(1, { message: "Field is required" }),
  questionId: z.number().optional(),
  metadataType: z.enum(METADATA_TYPES),
});

export const metadataAnswerFormSchema = z.object({
  isTocChecked: z.boolean().default(false),
  data: z.array(fieldSchema),
});
export type CreateMetadataAnswerFormFields = z.infer<
  typeof metadataAnswerFormSchema
>;

type MetadataFormProps = {
  surveyUuid: string;
  metadataQuestions: MetadataQuestionModel[];
};

const MetadataForm = ({ metadataQuestions, surveyUuid }: MetadataFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<CreateMetadataAnswerFormFields>({
    resolver: zodResolver(metadataAnswerFormSchema),
  });

  const onSubmit = async (data: CreateMetadataAnswerFormFields) => {
    setIsLoading(true);
    await handleSubmitMetadataForm(surveyUuid, data);
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
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
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

export default MetadataForm;
