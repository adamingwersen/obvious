"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const AuthErrorPage = () => {
  const router = useRouter();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5">
      <p>There was a problem with authorizing you. Please try again</p>
      <Button variant="outline" onClick={() => router.push("/auth/login")}>
        Go to log in page
      </Button>
      <p>
        If the problem persists you can reach us on{" "}
        <a className="underline" href="mailto:info@obvious.earth">
          info@obvious.earth
        </a>
      </p>
    </div>
  );
};

export default AuthErrorPage;
