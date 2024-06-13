import CopyToClipboardButton from "@/components/core/copy-to-clipboard-button";
import ShareForm from "@/components/forms/share-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import { ArrowRight } from "lucide-react";
import {
  handleCreateManyRespondentsAndSendEmails,
  handleDeleteRespondent,
  handleSendManyInviteEmailsWithResend,
} from "./actions";

const SharingPage = async ({ params }: { params: { surveyUuid: string } }) => {
  const survey = await api.survey.findByUuidWithRespondents({
    uuid: params.surveyUuid,
  });
  const respondentUserIds = survey.respondents.map((x) => {
    return {
      id: x.respondentUserId,
    };
  });
  if (!respondentUserIds)
    throw new Error("Got null or undefined for respondents?");
  const respondents = await api.user.findManyById(respondentUserIds);

  return (
    <div className="flex h-full flex-col space-y-4 pt-10">
      <div className="relative h-full w-2/5 items-center self-center rounded-md border p-4">
        <p className="flex justify-center py-5">Send to email</p>
        <ShareForm
          surveyId={survey.id}
          surveyUuid={params.surveyUuid}
          surveyRespondents={respondents}
          handleCreateManyRespondents={handleCreateManyRespondentsAndSendEmails}
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
            url={`${process.env.BASE_URL}/respond/${params.surveyUuid}`}
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
