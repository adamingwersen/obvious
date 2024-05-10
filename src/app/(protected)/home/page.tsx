import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-start space-y-6">
      <p>Home Page</p>
      <Link href="/survey/create">
        <Button>Create survey</Button>
      </Link>
      <Button variant="default" className="bg-lilla-700 gap-2 px-4">
        Add survey from document
      </Button>
      <Button variant="outline" className="gap-2">
        Go to surveys
      </Button>
    </div>
  );
};
export default HomePage;
