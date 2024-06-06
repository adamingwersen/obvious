"use client";

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
import {
  type ShareFormFields,
  formSchema,
} from "@/components/forms/schemas/share-form";

type ShareFormProps = {
  surveyId: number;
  surveyUuid: string;
  formFieldsFromServer: RespondentModel[];
  handleCreateManyRespondents: (data: ShareFormFields) => Promise<void>;
  handleDeleteRespondent: (email: string, surveyId: number) => Promise<void>;
  handleSendManyInviteEmailsWithResend: (
    emails: string[],
    surveyUuid: string,
  ) => Promise<void>;
};

const ShareForm = ({
  surveyId,
  surveyUuid,
  formFieldsFromServer,
  handleCreateManyRespondents,
  handleDeleteRespondent,
  handleSendManyInviteEmailsWithResend,
}: ShareFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const mapped = formFieldsFromServer.map(({ email }) => ({
    email,
    surveyId,
  }));

  const data = {
    emails: mapped,
  };

  const inputToZod =
    data.emails.length > 0
      ? data
      : { emails: [{ email: "", surveyId: surveyId }] };

  const form = useForm<ShareFormFields>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    values: inputToZod,
  });

  const { fields, append, remove } = useFieldArray({
    name: "emails",
    control: form.control,
  });

  const onDelete = async (index: number, email: string, surveyId: number) => {
    remove(index);
    await handleDeleteRespondent(email, surveyId);
    toast({
      title: "Removed email from list",
      description: new Date().toLocaleString(),
    });
  };

  const onSubmit = async (values: ShareFormFields) => {
    setIsLoading(true);
    const existingEmails = formFieldsFromServer.map((field) => field.email);
    const newEmails = values.emails.filter(
      (email) => !existingEmails.includes(email.email),
    );
    const onlyNewEmails = newEmails.map((item) => item.email);
    await handleCreateManyRespondents({ emails: newEmails });
    await handleSendManyInviteEmailsWithResend(onlyNewEmails, surveyUuid);
    setIsLoading(false);
    toast({
      title: "Sending emails...",
      description: `${new Date().toLocaleString()} - it may take a few minutes for the recipient to recieve the email invitation`,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-2 px-10"
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
                        onClick={() =>
                          onDelete(index, field.email, field.surveyId)
                        }
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

export default ShareForm;