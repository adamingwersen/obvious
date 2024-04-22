"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormFieldInput } from "@/components/ui/form";
import { handleCreateSurveyFormSubmit } from "@/app/(protected)/survey/create/actions";
import Link from "next/link";

const formSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "5 characters or more",
    })
    .max(255, { message: "Max 255 characters" }),
});

export type CreateSurveyFormFields = z.infer<typeof formSchema>;

const SurveyCreatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<CreateSurveyFormFields>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: CreateSurveyFormFields) => {
    setIsLoading(true);
    await handleCreateSurveyFormSubmit(data);
    setIsLoading(false);
    form.reset();
  };

  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-6">
      <h1 className="mt-10 text-3xl font-extrabold tracking-tight">
        Create survey
      </h1>
      <Form {...form}>
        <form
          className="flex w-1/4  flex-col gap-4"
          onSubmit={form.handleSubmit((data) => onSubmit(data))}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormFieldInput
                type="text"
                placeholder="Survey: E1 for suppliers"
                {...field}
              />
            )}
          />
          <div className="flex flex-row justify-between">
            <Link href="/home">
              <Button variant="outline">Back</Button>
            </Link>
            <Button variant="default" isLoading={isLoading} type="submit">
              Create survey
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SurveyCreatePage;
