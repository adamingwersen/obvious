"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormFieldInput,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { type SettingsFormField, formSchema } from "./schemas/settings";
import { type OrganisationModel, type UserModel } from "@/server/db/schema";
import { useRouter } from "next/navigation";
import { useUserActions } from "@/hooks/server-actions/user";

type SettingsFormProps = {
  user: UserModel;
  org: OrganisationModel;
};

const SettingsForm = ({ user, org }: SettingsFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useUserActions();

  const form = useForm<SettingsFormField>({
    resolver: zodResolver(formSchema),
    values: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      describedRole: user.describedRole,
      name: org.name,
      headquarters: org.headquarters,
      industry: org.industry,
      size: org.size,
    },
  });

  const onUpdateSettings = async (data: SettingsFormField) => {
    setIsLoading(true);
    await updateUser(data);
    router.push("/home");
    setIsLoading(false);
  };

  return (
    <div className="mx-auto flex w-full flex-col items-center gap-6">
      <Form {...form}>
        <form className="flex w-full flex-col gap-4">
          <div className="flex flex-row space-x-10">
            <div className="flex-grow">
              <h1 className="p-4 text-lg font-extralight">User</h1>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormFieldInput
                      type="text"
                      disabled={true}
                      {...field}
                      // @ts-expect-error Removes an error in the console
                      ref={null}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormFieldInput
                      type="text"
                      disabled={true}
                      {...field}
                      // @ts-expect-error Removes an error in the console
                      ref={null}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormFieldInput
                      type="text"
                      disabled={true}
                      {...field}
                      // @ts-expect-error Removes an error in the console
                      ref={null}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="describedRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormFieldInput
                      type="text"
                      {...field}
                      // @ts-expect-error Removes an error in the console
                      ref={null}
                    />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-grow">
              <h1 className="p-4 text-lg font-extralight">Organisation</h1>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormFieldInput
                      type="text"
                      disabled={true}
                      {...field}
                      // @ts-expect-error Removes an error in the console
                      ref={null}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="headquarters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headquaters</FormLabel>
                    <FormFieldInput
                      type="text"
                      disabled={true}
                      {...field}
                      // @ts-expect-error Removes an error in the console
                      ref={null}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormFieldInput
                      type="text"
                      disabled={true}
                      {...field}
                      // @ts-expect-error Removes an error in the console
                      ref={null}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormFieldInput
                      type="text"
                      disabled={true}
                      {...field}
                      // @ts-expect-error Removes an error in the console
                      ref={null}
                    />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* <Separator></Separator> */}

          <div className="flex flex-row justify-center">
            <Button
              variant="outline"
              isLoading={isLoading}
              onClick={form.handleSubmit((data) => onUpdateSettings(data))}
            >
              Save settings
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SettingsForm;
