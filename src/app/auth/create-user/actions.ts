"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { USER_PRIVILEGE, type UserPrivilegeType } from "@/server/db/schema";
import { createClient } from "@/server/supabase/server";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";

// Function to split name into parts and handle edge cases
const splitName = (
  name: string,
): { firstName: string | null; lastName: string | null } => {
  if (!name.trim()) {
    // If the name is empty or contains only spaces
    return { firstName: null, lastName: null };
  }

  let nameParts: string[] = name.trim().split(/\s+/);

  let firstName: string | null = nameParts[0] ?? null;
  let lastName: string | null = nameParts.slice(1).join(" ");

  return { firstName, lastName };
};

export const handleCreateUser = async (
  orgId: number,
  //   orgRole: "ADMIN" | "USER",
  //   privilege: "ORIGINATOR" | "RESPONDENT",
) => {
  // Should be passed
  const orgRole = "USER";
  const privilege = "ORIGINATOR";

  const supabase = createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) throw new Error("Cannot create user without authed account");
  if (!authUser.email)
    throw new Error("Cannot create user without email on account");
  console.log(authUser);
  const name: string = authUser.user_metadata.name ?? "";
  const { firstName, lastName } = splitName(name);

  await api.user.create({
    email: authUser.email,
    organisationId: orgId,
    authId: authUser.id,
    firstName: firstName,
    lastName: lastName,
    organisationRole: orgRole,
    privilege: privilege,
  });
  revalidatePath("/auth/create-user", "page");
};
