"use server";

import { type SettingsFormField } from "@/components/forms/schemas/settings";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";

export const handleUpdateUser = async (
  data: SettingsFormField,
  pathToRevalidate?: string,
) => {
  console.log("Updating user", data);
  await api.user.update(data);
  if (pathToRevalidate) revalidatePath(pathToRevalidate, "page");
};
