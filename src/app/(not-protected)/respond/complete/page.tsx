const RespondCompletePage = () => {
  return (
    <div className="flex h-full w-full flex-col justify-center space-y-4 pb-10 pt-10 ">
      <div className="mx-auto flex w-2/5 flex-col self-center rounded-md border bg-white p-4">
        {/* <div className="mx-auto flex items-center justify-center"> */}
        <p className="font-extralight">
          {
            "Thank you for filling out the survey. We will notify the requesting party that you have completed :)"
          }
        </p>
        {/* </div> */}
      </div>
    </div>
  );
};

export default RespondCompletePage;
