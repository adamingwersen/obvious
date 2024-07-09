import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { daysFromToday } from "@/lib/utils";
import { getRespondent } from "./actions";
import { redirect } from "next/navigation";
import Link from "next/link";

const RespondPage = async () => {
  const respondentUser = await getRespondent();
  if (!respondentUser) redirect("/respond/rejected");
  const survey = await api.survey.findById({ id: respondentUser.surveyId });
  const originator = survey.user;
  const nQuestions = survey.questions.length;

  const nextQuestionToAnswer = survey.questions.findIndex((q) => {
    const answer = q.answers.find(
      (a) => a.createdById === respondentUser.respondentUserId,
    );
    if (!answer) return true;
    return answer.content === "" && answer.cantAnswer === false;
  });

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
            {nextQuestionToAnswer === 0 ? ( // First question is unanswered
              <Link href="/respond/identified">
                <Button className="rounded-none bg-lilla-100 text-lilla-900 hover:bg-lilla-900 hover:text-white">
                  COMPLETE SURVEY
                </Button>
              </Link>
            ) : nextQuestionToAnswer !== -1 ? ( // Some question is answered
              <div className="space-y-2 font-light text-white">
                <p>{`Looks like you already completed [${nextQuestionToAnswer}/${nQuestions}] of this survey`}</p>
                <div className="flex items-center justify-center gap-3">
                  <Link href="/respond/identified">
                    <Button className="rounded-none bg-lilla-100 text-lilla-900 hover:bg-lilla-900 hover:text-white">
                      Start from the top
                    </Button>
                  </Link>
                  <p>or</p>
                  <Link
                    href={`/respond/identified/survey?startIndex=${nextQuestionToAnswer}`}
                  >
                    <Button className="rounded-none bg-lilla-100 text-lilla-900 hover:bg-lilla-900 hover:text-white">
                      Continue from {nextQuestionToAnswer}
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              // All questions are answered
              <div className="space-y-2 font-light text-white">
                <p>{`Looks like you already completed this survey`}</p>
                <div className="flex items-center justify-center gap-3">
                  <Link href="/respond/identified">
                    <Button className="rounded-none bg-lilla-100 text-lilla-900 hover:bg-lilla-900 hover:text-white">
                      Go through the survey again
                    </Button>
                  </Link>
                  <p>or</p>
                  <Link href="/respond/identified/survey/validate">
                    <Button className="rounded-none bg-lilla-100 text-lilla-900 hover:bg-lilla-900 hover:text-white">
                      Go to review your answers
                    </Button>
                  </Link>
                </div>
              </div>
            )}
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
