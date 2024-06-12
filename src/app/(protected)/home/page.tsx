import { Button } from "@/components/ui/button";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-start space-y-6">
      <p>Home Page</p>
      <Link href="/survey/create">
        <Button>Create survey</Button>
      </Link>
    </div>
  );
};
export default HomePage;
