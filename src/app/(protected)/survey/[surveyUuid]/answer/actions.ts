"use server";

import { createSignedDownloadUrl } from "@/server/supabase/server";
import { redirect, RedirectType } from "next/navigation";

// export const handleDownloadFile = async (
//   filePath: string,
//   answerId: number,
// ) => {
//   return await createSignedDownloadUrl(filePath, answerId);
// };

export async function handleDownloadFile(fileName: string, answerId: number) {
  const url = await createSignedDownloadUrl(fileName, answerId);
  redirect(url, RedirectType.replace);
}
