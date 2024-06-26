"use server";
import { createSignedDownloadUrl, DeleteFiles } from "@/server/supabase/server";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";

export type handleUpsertAnswerParams = {
  content?: string;
  questionId: number;
  answerId?: number;
  filePaths?: string[];
  pathToRevalidate?: string;
};

export async function handleAddFilePath(
  newPath: string,
  answerId: number,
  pathToRevalidate?: string,
) {
  try {
    await api.answer.addFilePath({ id: answerId, newPath: newPath });
  } catch (error) {}
  if (pathToRevalidate) revalidatePath(pathToRevalidate, "page");
}

export async function handleUpsertAnswer(params: handleUpsertAnswerParams) {
  // Upsert answer to get ID and existing filepaths used for potential file upload
  let answer = undefined;
  if (!params.answerId) {
    if (!params.content) throw new Error("Cant create answer without content");
    answer = await api.answer.create({
      content: params.content,
      documentUrls: params.filePaths,
      questionId: params.questionId,
    });
  } else {
    answer = await api.answer.update({
      content: params.content,
      id: params.answerId,
      documentUrls: params.filePaths,
    });
  }
  if (answer.length === 0 || answer[0] === undefined) {
    throw new Error("DB didnt return object for upsert answer operation");
  }
  answer = answer[0];
  if (params.pathToRevalidate) revalidatePath(params.pathToRevalidate, "page");

  return answer.id;
}

export async function handleDeleteFile(
  filePath: string,
  answerId: number,
  pathToRevalidate?: string,
) {
  // Remove file from Supabase
  await DeleteFiles(answerId, [filePath]);
  // Fetch answer from db
  const answer = await api.answer.findById({ id: answerId });
  if (answer.documentUrls === null)
    throw new Error(
      "Cant remove document from answer, no documents saved for answer",
    );

  const newDocPaths = answer.documentUrls.filter((x) => x !== filePath);

  await api.answer.update({
    id: answerId,
    documentUrls: newDocPaths,
  });
  if (pathToRevalidate) revalidatePath(pathToRevalidate, "page");
}

export async function handleDownloadFile(fileName: string, answerId: number) {
  const url = await createSignedDownloadUrl(fileName, answerId);
  redirect(url, RedirectType.replace);
}
