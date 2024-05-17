const RespondentQuestionnairePage = async ({
  params,
}: {
  params: { surveyUuid: string };
}) => {
  return (
    <div className="flex h-full w-full flex-col justify-center space-y-4 pb-10 pt-10 ">
      <div className="relative flex  w-2/5 flex-col self-center rounded-md border bg-white p-4 pb-10">
        <div className="flex flex-col px-20 pt-10 text-lg font-light">
          You did it!
        </div>
      </div>
    </div>
  );
};

export default RespondentQuestionnairePage;
