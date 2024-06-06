"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { USER_PRIVILEGE, type UserPrivilegeType } from "@/server/db/schema";
import { createClient } from "@/server/supabase/server";

export const signInWithPassword = async (email: string, password: string) => {
  const supabase = createClient();

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data.user;
};

export const signUp = async (email: string, password: string) => {
  const supabase = createClient();
  const origin = headers().get("origin");

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) throw error;

  return data.user;
};

export const signOut = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/auth");
};

export const updatePassword = async (password: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.updateUser({
    password,
  });
  // TODO - handle errors
  if (error) console.log(error);
  return data;
};

export const getAuthUser = async () => {
  const supabase = createClient();
  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser();
  if (!authUser?.email || error) return; // TODO - throw error

  return authUser;
};

export const inviteByEmail = async (
  email: string,
  role: UserPrivilegeType = USER_PRIVILEGE[0],
) => {
  const supabase = createServerActionClient(
    { cookies },
    { supabaseKey: process.env.SUPABASE_SERVICE_ROLE },
  );
  // TODO - Handle error case
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { role: role },
  });
  if (error) console.log(error);
  return data;
};

export type Provider = "google" | "azure";

export const signInWithProvider = async (provider: Provider) => {
  const supabase = createClient();

  const origin = headers().get("origin");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });
  if (data.url) {
    redirect(data.url);
  }
};
