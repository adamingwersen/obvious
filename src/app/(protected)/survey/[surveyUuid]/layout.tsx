import { Separator } from "@/components/ui/separator";
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
    <div className="relative h-full">
      <div className="flex items-center justify-center">
        <p className="text-lg font-bold">{survey.title}</p>
      </div>
      <Separator />
      <div className="mx-auto h-full py-6">{children}</div>
    </div>
  );
};

export default ConfigureSurveyLayout;
