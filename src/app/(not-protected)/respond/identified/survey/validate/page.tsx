"use sever";

import ViewAnswers from "@/components/answer/view-answers";
import { api } from "@/trpc/server";
import { getRespondent } from "../../../actions";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { FileActionsProvider } from "@/hooks/use-files";

import {
  handleAddFilePath,
  handleDeleteFile,
  handleDownloadFile,
} from "@/server/actions/answer/actions";

const RespondentSurveyValidatePage = async () => {
  const respondentUser = await getRespondent();
  if (!respondentUser) redirect("/respond/rejected");

  const survey = await api.survey.findById({ id: respondentUser.surveyId });

  return (
    <div className="flex h-full w-full flex-col justify-center space-y-4 pb-10 pt-10 ">
      <div className="mx-auto flex max-h-[90svh] w-3/5 flex-col justify-center gap-5 rounded-md bg-white p-4">
        <h1 className="text-center">Review your answers</h1>
        <div className="h-5/6">
          <FileActionsProvider
            downloadFile={handleDownloadFile}
            deleteFile={handleDeleteFile}
            addFileToAnswer={handleAddFilePath}
            pathToRevalidate="/(not-protected)/respond/identified/validate"
          >
            <ViewAnswers
              asOriginator={false}
              questions={survey.questions}
              respondents={[]}
            ></ViewAnswers>
          </FileActionsProvider>
        </div>
        <div className="flex justify-center">
          <Link href="/respond/complete">
            <Button className="rounded-none bg-lilla-100 text-lilla-900 hover:bg-lilla-900 hover:text-white">
              Finish
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RespondentSurveyValidatePage;
