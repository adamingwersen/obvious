import MetadataQuestionForm from "@/components/forms/metadata-question-form";
import { api } from "@/trpc/server";
import { handleCreateManySurveyMetadata } from "./actions";

const MetadataPage = async ({ params }: { params: { surveyUuid: string } }) => {
  const formFieldsFromServer = await api.metadataQuestion.findManyBySurveyUuid({
    surveyUuid: params.surveyUuid,
  });

  return (
    <div className="flex h-full flex-col space-y-4 pt-10">
      <div className="relative h-full w-1/3 self-center rounded-md border p-4">
        <p className="flex justify-center pb-5">
          Basic information for respondent to disclose
        </p>
        <MetadataQuestionForm
          surveyUuid={params.surveyUuid}
          formFieldsFromServer={formFieldsFromServer}
          handleCreateManySurveyMetadata={handleCreateManySurveyMetadata}
        />
      </div>
    </div>
  );
};

export default MetadataPage;
