import { DataTable } from "./_table/DataTable";
import { DataTableColumns } from "./_table/DataTableColumns";
import { Button } from "@/components/ui/button";
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

        <DataTable columns={DataTableColumns} data={surveys} />
      </div>
    </div>
  );
};

export default SurveyPage;
