"use server";

import { api } from "@/trpc/server";
import { type CreateQuestionFormFields } from "./_components/CreateQuestion";
import { revalidatePath } from "next/cache";
import { DeleteFiles, UploadFiles } from "@/server/supabase/server";

import { CreateAnswerFormFields } from "./_components/AnswerStep";

export const handleUpsertQuestionFormSubmit = async (
  data: CreateQuestionFormFields,
  surveyId: number,
  questionId?: number,
) => {
  if (!questionId) await api.question.create({ ...data, surveyId });
  if (questionId) await api.question.update({ ...data, id: questionId });

  revalidatePath(`/(protected)/survey/[surveyUuid]/configure`, "page");
};

export const handleUpsertAnswerFormSubmit = async (
  data: CreateAnswerFormFields,
  questionId: number,
  answerId?: number,
  filePaths?: string[],
) => {
  let answer = undefined;
  if (!answerId) {
    answer = await api.answer.create({
      ...data,
      documentIds: filePaths,
      questionId: questionId,
    });
  } else {
    answer = await api.answer.update({
      ...data,
      id: answerId,
      documentIds: filePaths,
    });
  }
  revalidatePath(`/(protected)/survey/[surveyUuid]/answer`, `page`);
  if (answer.length === 0 || answer[0] === undefined) {
    throw new Error("DB didnt return object for upsert answer operation");
  }

  return answer[0];
};

export const handleRemoveQuestion = async (questionId: number) => {
  await api.question.deleteById({ id: questionId });
  revalidatePath(`/(protected)/survey/[surveyUuid]/configure`, "page");

  // TODO: Add Toaster here
};

export const handleFindManyQuestionsBySurveyId = async (surveyId: number) => {
  await api.question.findManyBySurveyId({ surveyId: surveyId });
  revalidatePath(`/(protected)/survey/[surveyUuid]/answer`, "page");
};

export async function upsertAnswerFromForm(formData: FormData) {
  const content = formData.get("content") as string | null;
  if (!content) throw new Error("Content is required");

  const questionId =
    parseInt(formData.get("questionId") as string, 10) || undefined;
  if (!questionId) throw new Error("questionId is required");

  const answerId =
    parseInt(formData.get("answerId") as string, 10) || undefined;

  const files = formData.getAll("files") as unknown as File[] | [];
  try {
    // Upsert answer to get ID and existing filepaths used for potential file upload
    const insertedAnswer = await handleUpsertAnswerFormSubmit(
      { content },
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
      if (insertedAnswer.documentIds === null) {
        paths = newFilePaths;
      } else {
        // Add unique new to exisiting
        paths = insertedAnswer.documentIds.concat(
          newFilePaths.filter((x) => !insertedAnswer.documentIds?.includes(x)),
        );
      }

      await handleUpsertAnswerFormSubmit(
        { content },
        questionId,
        insertedAnswer.id,
        paths,
      );
    }
  } catch (error) {
    console.error("Failed to upload file", error);
    throw new Error("Error upserting answer from form");
  }
  revalidatePath(`/(protected)/survey/[surveyUuid]/answer`, "page");
}

export async function deleteFilesFromAnswer(
  filePaths: string[],
  answerId: number,
) {
  // Remove file from Supabase
  DeleteFiles(answerId, filePaths);

  // Fetch answer from db
  const answer = await api.answer.findById({ id: answerId });
  if (answer.documentIds === null)
    throw new Error(
      "Cant remove document from answer, no documents saved for answer",
    );

  const newDocPaths = answer.documentIds.filter((x) => !filePaths.includes(x));

  await api.answer.update({
    id: answerId,
    documentIds: newDocPaths,
  });
  revalidatePath(`/(protected)/survey/[surveyUuid]/answer`, "page");
}
