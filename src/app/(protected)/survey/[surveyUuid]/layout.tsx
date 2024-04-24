
import { api } from "@/trpc/server";

const ConfigureSurveyLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { surveyUuid: string };
}) => {
  const survey = await api.survey.findById({ uuid: params.surveyUuid });
  return (
    <div className="relative h-auto">
      <div className="flex justify-center ">
        <h1>Survey Name: {survey.title}</h1>
      </div>
      <div className="mx-auto">
        {children}
      </div>
    </div>
  );
};

export default ConfigureSurveyLayout;
