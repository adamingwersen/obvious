import { DataTable } from "./_table/DataTable";
import { DataTableColumns } from "./_table/DataTableColumns";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import Link from "next/link";

const SurveyPage = async () => {
  const surveys = await api.survey.findAllByCurrentUserWithRelations();

  return (
    <div>
      <div className="pt-10"></div>
      <div className="flex flex-row justify-end">
        <div className="px-80">
          <Link href="/survey/create">
            <Button>Create new survey</Button>
          </Link>
        </div>
      </div>

      <div className="px-80">
        <DataTable columns={DataTableColumns} data={surveys} />
      </div>
    </div>
  );
};

export default SurveyPage;
