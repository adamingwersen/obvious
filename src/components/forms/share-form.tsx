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
import { type UserModel } from "@/server/db/schema";
import {
  type ShareFormFields,
  formSchema,
} from "@/components/forms/schemas/share-form";

type ShareFormProps = {
  surveyId: number;
  surveyUuid: string;
  surveyRespondents: UserModel[];
  handleCreateManyRespondentsAndSendEmails: (
    data: ShareFormFields,
    surveyUuid: string,
  ) => Promise<void>;
  handleDeleteRespondent: (userId: number, surveyId: number) => Promise<void>;
};

const ShareForm = ({
  surveyId,
  surveyUuid,
  surveyRespondents,
  handleCreateManyRespondentsAndSendEmails,
  handleDeleteRespondent,
}: ShareFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const mapped = surveyRespondents.map(({ email, id }) => ({
    userId: id,
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

  const onDelete = async (
    index: number,
    userId: number | undefined,
    surveyId: number,
  ) => {
    remove(index);

    if (!userId) throw new Error("No user id");
    await handleDeleteRespondent(userId, surveyId);
    toast({
      title: "Removed email from list",
      description: new Date().toLocaleString(),
    });
  };

  const onSubmit = async (values: ShareFormFields) => {
    setIsLoading(true);
    const existingEmails = surveyRespondents.map((field) => field.email);
    const newEmails = values.emails.filter(
      (email) => !existingEmails.includes(email.email),
    );
    await handleCreateManyRespondentsAndSendEmails(
      { emails: newEmails },
      surveyUuid,
    );
    // const onlyNewEmails = newEmails.map((user) => user.email);
    // await handleSendManyInviteEmailsWithResend(onlyNewEmails, surveyUuid);
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
        className="flex w-full flex-col space-y-2 px-5"
      >
        <FormField
          control={form.control}
          name="emails"
          render={() => (
            <>
              {fields.map((field, index) => {
                return (
                  <div key={index} className="flex w-full gap-x-4 py-1">
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
                      variant="outline"
                      onClick={() =>
                        onDelete(index, field?.userId, field.surveyId)
                      }
                    >
                      <Trash className="size-4" />
                    </Button>
                  </div>
                );
              })}
            </>
          )}
        />

        <div className="flex flex-row justify-between pt-5">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => append({ email: "", surveyId: surveyId })}
          >
            <Plus className="size-4" />
            Add email
          </Button>

          <Button
            variant="outline"
            className="gap-2"
            type="submit"
            isLoading={isLoading}
          >
            <Send className="size-4" />
            Send invite(s)
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ShareForm;
