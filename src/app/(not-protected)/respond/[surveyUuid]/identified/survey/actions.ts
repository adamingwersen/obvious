"use server";

import { api } from "@/trpc/server";

import { revalidatePath } from "next/cache";
import { DeleteFiles, UploadFiles } from "@/server/supabase/server";
import { type CreateAnswerFormFields } from "@/components/forms/schemas/answer-step";
import { cookies } from "next/headers";

const getRespondent = async () => {
  const respondent_uuid = cookies().get("respondent-identifier")?.value;
  if (!respondent_uuid)
    throw new Error("Whoops. Unable to identify respondent");
  const respondent = await api.respondent.findByUuid({ uuid: respondent_uuid });
  return respondent;
};

const upsertAnswer = async (
  data: CreateAnswerFormFields,
  respondentId: number,
  questionId: number,
  answerId?: number,
  filePaths?: string[],
) => {
  let answer = undefined;
  if (!answerId) {
    answer = await api.answer.create({
      ...data,
      documentUrls: filePaths,
      questionId: questionId,
      respondentId: respondentId,
    });
  } else {
    answer = await api.answer.update({
      ...data,
      id: answerId,
      documentUrls: filePaths,
    });
  }

  if (answer.length === 0 || answer[0] === undefined) {
    throw new Error("DB didnt return object for upsert answer operation");
  }

  return answer[0];
};

export const handleGetQuestionsAnswers = async (questionIds: number[]) => {
  const respondent = await getRespondent();
  if (!respondent) throw new Error("Cant get answers without respondent!");

  const respondentAnswers = await api.answer.findManyByQuestionIdsForRespondent(
    {
      questionIds: questionIds,
      respondentId: respondent.id,
    },
  );
  return respondentAnswers;
};

export async function handleUpsertAnswer(formData: FormData) {
  const content = formData.get("content") as string | null;
  if (!content) throw new Error("Content is required");

  const respondent = await getRespondent();
  if (!respondent)
    throw new Error("Cannot repond to survey questions without a responder!");

  const questionId =
    parseInt(formData.get("questionId") as string, 10) || undefined;
  if (!questionId) throw new Error("questionId is required");

  const answerId =
    parseInt(formData.get("answerId") as string, 10) || undefined;

  const files = formData.getAll("files") as unknown as File[] | [];
  try {
    // Upsert answer to get ID and existing filepaths used for potential file upload
    const insertedAnswer = await upsertAnswer(
      { content },
      respondent.id,
      questionId,
      answerId,
      undefined,
    );
    if (insertedAnswer === null)
      throw new Error("Didnt recieve object from db when upserting");

    // Upload potential files
    if (files.length > 0) {
      const newFilePaths = await UploadFiles(insertedAnswer.id, files);

      // Handle existing paths and make sure there is no duplicates
      let paths = undefined;
      if (insertedAnswer.documentUrls === null) {
        paths = newFilePaths;
      } else {
        // Add unique new to exisiting
        paths = insertedAnswer.documentUrls.concat(
          newFilePaths.filter((x) => !insertedAnswer.documentUrls?.includes(x)),
        );
      }

      await upsertAnswer(
        { content },
        respondent.id,
        questionId,
        insertedAnswer.id,
        paths,
      );
    }
  } catch (error) {
    console.error("Failed to upload file", error);
    throw new Error("Error upserting answer from form");
  }
  revalidatePath("/(not-protected)/respond/[surveyUuid]/survey", "page");
}

export async function handleDeleteFilesFromAnswer(
  filePaths: string[],
  answerId: number,
) {
  // Remove file from Supabase
  await DeleteFiles(answerId, filePaths);

  // Fetch answer from db
  const answer = await api.answer.findById({ id: answerId });
  if (answer.documentUrls === null)
    throw new Error(
      "Cant remove document from answer, no documents saved for answer",
    );

  const newDocPaths = answer.documentUrls.filter((x) => !filePaths.includes(x));

  await api.answer.update({
    id: answerId,
    documentUrls: newDocPaths,
  });
  revalidatePath(`/(not-protected)/respond/[surveyUuid]/survey`, "page");
}
