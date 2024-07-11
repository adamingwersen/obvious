"use client";

import { signInWithPassword, signInWithProvider } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import EmailAuthForm from "@/components/forms/email-auth-form";

export default function LoginPage() {
  const { toast } = useToast();

  const onSubmit = async (email: string, password: string) => {
    try {
      await signInWithPassword(email, password);
    } catch (error) {
      toast({ title: "unable to sign in" });
      console.error("Error signing in", error);
    }
  };

  return (
    <div className="mx-auto flex h-full items-center justify-center">
      <div className="mx-auto flex flex-col items-center justify-center gap-2">
        <h1>Welcome back</h1>
        <Button
          onClick={async () => {
            await signInWithProvider("google");
          }}
          variant="outline"
          className="w-72 gap-4 rounded-sm"
        >
          <Image
            width={16}
            height={16}
            src="/google_logo.png"
            alt="google-icon"
          />
          Sign in with Google
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            await signInWithProvider("azure");
          }}
          className="w-72 gap-4 rounded-sm"
        >
          <Image
            width={32}
            height={32}
            src="/Outlook_40x40.svg"
            alt="outlook-icon"
          />
          Sign in with Outlook
        </Button>
        <div className="flex w-72 flex-grow items-center justify-center">
          <hr className="flex-grow border border-gray-200" />
          <span className="px-4 text-xs text-gray-200">OR</span>
          <hr className=" flex-grow border border-gray-200" />
        </div>

        <EmailAuthForm authType="login" onAuthSubmit={onSubmit} />
      </div>
    </div>
  );
}
