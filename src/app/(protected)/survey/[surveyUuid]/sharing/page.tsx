import CopyToClipboardButton from "@/components/core/copy-to-clipboard-button";
import ShareForm from "@/components/forms/share-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import { ArrowRight } from "lucide-react";
import {
  handleDeleteRespondent,
  handleCreateManyRespondentsAndSendEmails,
} from "./actions";
import Link from "next/link";

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
      <div className="relative h-full w-4/5 items-center self-center rounded-md border p-4 md:w-3/5 lg:w-2/5">
        <p className="flex justify-center py-5 text-xl font-extralight">
          Send to email
        </p>
        <ShareForm
          surveyId={survey.id}
          surveyUuid={params.surveyUuid}
          surveyRespondents={respondents}
          handleCreateManyRespondentsAndSendEmails={
            handleCreateManyRespondentsAndSendEmails
          }
          handleDeleteRespondent={handleDeleteRespondent}
        />
        <div className="flex justify-center pt-5">
          <Separator />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="py-5 text-xl font-extralight">Copy link</p>
          <CopyToClipboardButton
            text={`respond/${params.surveyUuid}`}
            url={`${process.env.BASE_URL}/respond/${params.surveyUuid}`}
          />
        </div>
        <div className="absolute bottom-6 right-6">
          <Link href="/survey">
            <Button variant="default" className="gap-2">
              Finish
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SharingPage;
