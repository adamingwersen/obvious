import MetadataDynamicForm from "../_components/MetadataDynamicForm";
import { api } from "@/trpc/server";

const MetadataPage = async ({ params }: { params: { surveyUuid: string } }) => {
  const formFieldsFromServer = await api.surveyMetadata.findManyBySurveyUuid({
    surveyUuid: params.surveyUuid,
  });

  return (
    <div className="flex h-full flex-col space-y-4 pt-10">
      <div className="relative h-full w-1/3 self-center rounded-md border p-4">
        <p className="flex justify-center pb-5">
          Basic information for respondent to disclose
        </p>
        <MetadataDynamicForm
          surveyUuid={params.surveyUuid}
          formFieldsFromServer={formFieldsFromServer}
        />
      </div>
    </div>
  );
};

export default MetadataPage;
