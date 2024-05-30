"use client";

import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Send, Trash } from "lucide-react";
import { type RespondentModel } from "@/server/db/schema";
import { handleCreateManyRespondents } from "@/app/(protected)/survey/[surveyUuid]/sharing/actions";

const formSchema = z.object({
  emails: z.array(
    z.object({
      email: z.string().email(),
      surveyId: z.number(),
    }),
  ),
});

export type ShareDynamicFormFields = z.infer<typeof formSchema>;

type ShareDynamicFormProps = {
  surveyId: number;
  formFieldsFromServer: RespondentModel[];
};

const ShareDynamicForm = ({
  surveyId,
  formFieldsFromServer,
}: ShareDynamicFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const mapped = formFieldsFromServer.map(({ email }) => ({
    email,
    surveyId,
  }));

  const data = {
    emails: mapped,
  };

  const form = useForm<ShareDynamicFormFields>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    values: data,
    defaultValues:
      mapped.length > 0
        ? undefined
        : {
            emails: [{ email: "kate@acme.co", surveyId: surveyId }],
          },
  });

  const { fields, append, remove } = useFieldArray({
    name: "emails",
    control: form.control,
  });

  const onDelete = (index: number) => {
    remove(index);
    // drop from respondents
    toast({
      title: "Removed email from list",
      description: new Date().toLocaleString(),
    });
  };

  const onSubmit = async (values: ShareDynamicFormFields) => {
    console.log("onSubmit");
    console.log({ values });
    setIsLoading(true);
    await handleCreateManyRespondents(values);
    setIsLoading(false);
    toast({
      title: "Sending emails...",
      description: new Date().toLocaleString(),
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
        className="flex w-full flex-col space-y-5 px-10"
      >
        <FormField
          control={form.control}
          name="emails"
          render={() => (
            <>
              {fields.map((field, index) => {
                return (
                  <div key={index} className="flex w-full">
                    <div className="flex w-2/3 gap-x-4 py-1">
                      <FormField
                        control={form.control}
                        key={field.id}
                        name={`emails.${index}.email`}
                        render={({ field }) => {
                          return (
                            <FormItem className="w-full">
                              <FormControl>
                                <Input {...field} className="w-full" />
                              </FormControl>
                              <FormMessage className="capitalize text-red-500" />
                            </FormItem>
                          );
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => onDelete(index)}
                      >
                        <Trash className="size-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        />

        <div className="flex w-2/3 flex-row justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            className="mt-2 w-1/2 gap-2"
            onClick={() => append({ email: "", surveyId: surveyId })}
          >
            <Plus className="size-4" />
            Add email
          </Button>

          <Button className="mt-2 gap-2" type="submit" isLoading={isLoading}>
            <Send className="size-4" />
            Send invite(s)
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ShareDynamicForm;
