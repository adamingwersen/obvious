"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormFieldInput } from "@/components/ui/form";
import {
  type AuthFormFields,
  formSchema,
  formSchemaWithPasswordRequirements,
} from "@/components/forms/schemas/email-auth";

type AuthType = "login" | "signup";

type EmailAuthFormProps = {
  authType: AuthType;
  onAuthSubmit: (email: string, password: string) => Promise<void>;
};

export default function EmailAuthForm({
  authType,
  onAuthSubmit,
}: EmailAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AuthFormFields>({
    resolver: zodResolver(
      authType === "login" ? formSchema : formSchemaWithPasswordRequirements,
    ),
  });

  const onSubmit = async (data: AuthFormFields) => {
    const { email, password } = data;
    setIsLoading(true);
    await onAuthSubmit(email, password);
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormFieldInput type="email" placeholder="Email" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormFieldInput type="password" placeholder="Password" {...field} />
          )}
        />

        <Button variant="default" isLoading={isLoading} type="submit">
          {authType === "login" ? "Log in" : "Sign up"}
        </Button>
      </form>
    </Form>
  );
}
