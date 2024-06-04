"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { handleValidateRespondent } from "./actions";
import { Form, FormField, FormFieldInput } from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email(),
});

export type ValidateRespondentFormFields = z.infer<typeof formSchema>;

const RespondentIdentifyPage = ({
  params,
}: {
  params: { surveyUuid: string };
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ValidateRespondentFormFields>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ValidateRespondentFormFields) => {
    setIsLoading(true);
    await handleValidateRespondent(params.surveyUuid, data);
    setIsLoading(false);
    form.reset();
  };

  return (
    <div className="flex h-full w-full flex-col justify-center space-y-4 pb-10 pt-10 ">
      <div className="relative flex h-2/6 w-2/5 flex-col self-center rounded-md border bg-white p-4">
        <div className="flex flex-col content-center items-center justify-center gap-4 ">
          <div className="w-2/3  text-center font-light">
            To ensure correct information, we need to verify that you are the
            inteded respondent of this survey. Choose method below.
          </div>
          <div className="flex w-full flex-row gap-1  pt-4">
            <Form {...form}>
              <form
                className="flex w-full flex-row justify-center gap-2"
                onSubmit={form.handleSubmit((data) => onSubmit(data))}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormFieldInput
                      className="w-[280px]"
                      type="text"
                      placeholder="susan@email.com"
                      {...field}
                    />
                  )}
                />
                <Button className="" type="submit" isLoading={isLoading}>
                  <ArrowRight className="size-4" />
                </Button>
              </form>
            </Form>
          </div>

          <div className="flex flex-row pt-5">
            <p className="font-light text-gray-400">- OR -</p>
          </div>
          <div className="flex flex-col gap-2 pt-5">
            <Button variant="outline" className="gap-x-1 font-light">
              <Image
                className="size-6"
                src="/google_logo.png"
                alt="hello"
                width={100}
                height={100}
              />
              Sign in with Google
            </Button>
            <Button variant="outline" className="font-light">
              <Image
                className="size-10"
                src="/Outlook_40x40.svg"
                alt="hello"
                width={100}
                height={100}
              />
              Sign in with Outlook
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RespondentIdentifyPage;
