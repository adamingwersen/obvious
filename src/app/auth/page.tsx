"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  // TODO - route the user to home if they're already logged in
  const router = useRouter();

  return (
    <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-2">
      <Button
        variant="outline"
        onClick={() => {
          router.push("/auth/login");
        }}
        className="w-72 gap-4 rounded-sm"
      >
        Log in
      </Button>
      <Button
        variant="outline"
        className="w-72 gap-4 rounded-sm"
        onClick={() => {
          router.push("/auth/signup");
        }}
      >
        Sign up
      </Button>
    </div>
  );
}
