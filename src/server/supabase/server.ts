import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import type { CookieOptions } from "@supabase/ssr";
import { answer } from "../db/schema";

export const createClient = () => {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};

export const SUPABASE_BUCKET_PATH = "uploads";

export const UploadFiles = async (answerId: number, files: File[]) => {
  const client = createClient();

  const uploadFiles = files.map(async (file) => {
    const { error } = await client.storage
      .from(SUPABASE_BUCKET_PATH)
      .upload(getRemoteFilePath(file.name, answerId), file);

    if (error) {
      if (error.message === "The resource already exists") {
        return file.name;
      } else {
        console.error("Error uploading file", error);
        throw new Error("Error uploading file");
      }
    } else {
      return file.name;
    }
  });

  try {
    const filePaths = await Promise.all(uploadFiles);
    return filePaths;
  } catch (error) {
    console.error("Error uploading files:", error);
    return [];
  }
};

export const DeleteFiles = async (answerId: number, filePaths: string[]) => {
  const client = createClient();
  const _filePaths = filePaths.map((f) => getRemoteFilePath(f, answerId));
  const { data, error } = await client.storage
    .from(SUPABASE_BUCKET_PATH)
    .remove(_filePaths);
  if (error) {
    throw new Error("Error removing file", error);
  }
};

export const getRemoteFilePath = (filename: string, answerId: number) => {
  return `${answerId}/${filename}`;
};
