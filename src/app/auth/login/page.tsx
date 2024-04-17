"use client";

import { useRouter } from "next/navigation";
import { signInWithPassword } from "@/app/auth/actions";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormFieldInput } from "@/components/ui/form";

const formSchema = z.object({
  email: z.string(),
  password: z
    .string()
    .min(8, { message: "Passwords are at least 8 characters" }),
});

export type FormFields = z.infer<typeof formSchema>;

export default function LoginPage() {
  // TODO - route the user to home if they're already logged in
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormFields) => {
    const { email, password } = data;

    setIsLoading(true);
    const res = await signInWithPassword(email, password);
    if (!res) return; // TODO - throw error
    setIsLoading(false);
    router.push("/home");
  };

  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Sign In</h1>
      <Form {...form}>
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={form.handleSubmit((data) => onSubmit(data))}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormFieldInput type="text" placeholder="Email" {...field} />
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormFieldInput
                type="password"
                placeholder="Password"
                {...field}
              />
            )}
          />

          <Button variant="default" isLoading={isLoading} type="submit">
            Sign in
          </Button>
        </form>
      </Form>
    </div>
  );
}
