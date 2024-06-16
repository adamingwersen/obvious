"use server";

import { createSignedDownloadUrl } from "@/server/supabase/server";

export const handleCreateSignedLink = async (
  filePath: string,
  answerId: number,
) => {
  return await createSignedDownloadUrl(filePath, answerId);
};
