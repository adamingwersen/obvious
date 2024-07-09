const RespondCompletePage = () => {
  return (
    <div className="flex h-full w-full flex-col justify-center ">
      <div className="relative mx-auto flex h-2/6 w-2/5 flex-col gap-2 self-center border bg-white p-10 text-center font-extralight">
        <h1>You are done</h1>
        <p className="">Thank you for filling out the survey.</p>
        <p>
          {"We will notify the requesting party that you have completed :)"}
        </p>
        <div className="absolute bottom-6 self-center font-light">
          This survey was built with <b className="font-bold">Obvious</b>.{" "}
          <a href="https://www.obvious.earth" className="underline">
            Visit website
          </a>
        </div>
      </div>
    </div>
  );
};

export default RespondCompletePage;
