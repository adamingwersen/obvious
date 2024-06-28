import { DataTable } from "@/components/tables/survey-table/data-table";
import { DataTableColumns } from "@/components/tables/survey-table/data-table-columns";
import { Button } from "@/components/ui/button";
import { SurveyActionsProvider } from "@/hooks/server-actions/survey";
import { handleRenameSurveyName } from "@/server/actions/survey/actions";
import { api } from "@/trpc/server";
import Link from "next/link";

const SurveyPage = async () => {
  const surveys = await api.survey.findAllByCurrentUserWithRelations();

  return (
    <div className="flex h-full w-full flex-col pt-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col">
        <Link href="/survey/create" className="self-end">
          <Button>Create new survey</Button>
        </Link>
        <SurveyActionsProvider handleRenameSurvey={handleRenameSurveyName}>
          <DataTable columns={DataTableColumns} data={surveys} />
        </SurveyActionsProvider>
      </div>
    </div>
  );
};

export default SurveyPage;
