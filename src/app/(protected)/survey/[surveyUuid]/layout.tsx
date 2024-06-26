import { api } from "@/trpc/server";

const ConfigureSurveyLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { surveyUuid: string };
}) => {
  const survey = await api.survey.findByUuid({ uuid: params.surveyUuid });
  return (
    <div className="flex h-full w-full flex-col items-stretch justify-center">
      <h1 className="flex self-center text-center">{survey.title}</h1>
      {children}
    </div>
  );
};

export default ConfigureSurveyLayout;
