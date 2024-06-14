import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import Link from "next/link";
import { daysFromToday } from "@/lib/utils";

const RespondPage = async ({ params }: { params: { surveyUuid: string } }) => {
  const survey = await api.survey.findByUuid({ uuid: params.surveyUuid });
  const originator = survey.user;
  const nQuestions = survey.questions.length;
  const respondentUser = await getRespondent();

  return (
    <div className="flex h-full w-full flex-col justify-center space-y-4 pb-10 pt-10 ">
      <div className="relative flex h-5/6 w-2/5 flex-col self-center rounded-md border bg-white p-4">
        <div className="flex h-1/6 w-full flex-col items-center justify-center gap-6 self-center bg-lilla-700">
          <div className="font-light text-white">
            <b>
              {originator?.firstName} {originator.lastName}
            </b>{" "}
            wants you to complete a Due Diligence survey
          </div>
          <div className="">
            <Link href={`/respond/${params.surveyUuid}/identify`}>
              <Button className="rounded-none bg-lilla-100 text-lilla-900 hover:bg-lilla-900 hover:text-white">
                COMPLETE SURVEY
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-6 pt-5">
          <div className="mx-10 rounded-md bg-gray-100 px-2 py-2">
            This survey contains <b>{nQuestions} questions</b>
          </div>
          <div className="mx-10 rounded-md bg-gray-100 px-2 py-2">
            {!survey.dueAt && <p>There is no due date</p>}
            {survey.dueAt && (
              <p>
                This survey is due in <b>{daysFromToday(survey.dueAt)} days</b>
              </p>
            )}
          </div>
        </div>
        <div className="absolute bottom-6 self-center font-light">
          This survey was built with <b className="font-bold">Obvious</b>.{" "}
          <a href="www.obvious.earth" className="underline">
            Visit website
          </a>
        </div>
      </div>
    </div>
  );
};

export default RespondPage;
