import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import Link from "next/link";

const SurveyPage = async () => {
  const surveys = await api.survey.findAllByCurrentUser();

  return (
    <div>
      <h1 className="text-lg font-bold">Survey Page</h1>
      <div className="ml-10 mt-6 flex flex-col space-y-2">
        {surveys.map((survey) => (
          <Link
            href={`/survey/${survey.uuid}/configure`}
            key={survey.id}
            className="max-w-52 rounded border border-primary p-4"
          >
            {survey.id} {survey.title}
          </Link>
        ))}
      </div>
      <div className="justify-end pt-3"></div>
      <Link href="/survey/create">
        <Button>Create survey</Button>
      </Link>
    </div>
  );
};

export default SurveyPage;
