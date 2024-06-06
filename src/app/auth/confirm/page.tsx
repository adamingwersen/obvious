"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ConfirmPage() {
  const router = useRouter();

  return (
    <div className="mx-auto flex h-full flex-col items-center justify-center gap-4">
      <h1>Account created</h1>
      <p>We have sent you an email that you need to confirm to login</p>
      <Button
        variant={"outline"}
        className="w-72 gap-4 rounded-sm"
        onClick={() => {
          router.push("/auth/login");
        }}
      >
        Go to login page
      </Button>
    </div>
  );
}
