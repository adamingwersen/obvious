import CopyToClipboardButton from "@/components/core/copy-to-clipboard-button";
import ShareForm from "@/components/forms/share-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import { ArrowRight } from "lucide-react";
import {
  handleCreateManyRespondents,
  handleDeleteRespondent,
  handleSendManyInviteEmailsWithResend,
} from "./actions";

const SharingPage = async ({ params }: { params: { surveyUuid: string } }) => {
  const survey = await api.survey.findByUuid({ uuid: params.surveyUuid });
  const respondents = await api.respondent.findBySurveyUuid({
    uuid: params.surveyUuid,
  });

  return (
    <div className="flex h-full flex-col space-y-4 pt-10">
      <div className="relative h-full w-2/5 items-center self-center rounded-md border p-4">
        <p className="flex justify-center py-5">Send to email</p>
        <ShareForm
          surveyId={survey.id}
          surveyUuid={params.surveyUuid}
          formFieldsFromServer={respondents}
          handleCreateManyRespondents={handleCreateManyRespondents}
          handleDeleteRespondent={handleDeleteRespondent}
          handleSendManyInviteEmailsWithResend={
            handleSendManyInviteEmailsWithResend
          }
        />
        <div className="flex justify-center pt-5">
          <Separator className="flex w-2/3" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className=" py-5">Copy link</p>
          <CopyToClipboardButton
            text={`respond/${params.surveyUuid}`}
            url={`localhost:3000/respond/${params.surveyUuid}`}
          />
        </div>
        <div className="absolute bottom-6 right-6">
          <Button variant="outline" className="gap-2">
            Finish
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SharingPage;
