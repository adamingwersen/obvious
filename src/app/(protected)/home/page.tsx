import { Button } from "@/components/ui/button";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="my-10">
        <p>Home Page</p>
      </div>
      <div>
        {" "}
        <Link href="/survey/create">
          <Button>Create survey</Button>
        </Link>
      </div>
    </div>
  );
};
export default HomePage;
