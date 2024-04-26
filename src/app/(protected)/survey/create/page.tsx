"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormFieldInput,
  FormFieldTextArea,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { handleCreateSurveyFormSubmit } from "@/app/(protected)/survey/create/actions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "5 characters or more",
    })
    .max(255, { message: "Max 255 characters" }),
  description: z.string(),
  dueAt: z.date().nullable().optional(),
});

export type CreateSurveyFormFields = z.infer<typeof formSchema>;

const SurveyCreatePage = () => {
  const router = useRouter();
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
    <div className="flex h-full w-full flex-col items-center justify-start space-y-6">
      <h1 className="mb-10 mt-10 text-3xl font-extrabold tracking-tight">
        Create survey
      </h1>
      <Form {...form}>
        <form
          className=" flex  w-1/4 flex-col gap-3"
          onSubmit={form.handleSubmit((data) => onSubmit(data))}
        >
          <FormLabel>Title</FormLabel>
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
          <FormLabel>Description</FormLabel>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormFieldTextArea
                className="h-[180px]"
                placeholder="What's this survey about..."
                {...field}
              />
            )}
          />
          <FormLabel>Due date</FormLabel>
          <FormField
            control={form.control}
            name="dueAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row justify-between">
            <Button
              variant="outline"
              onClick={() => router.back()}
              type="button"
            >
              Back
            </Button>
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
