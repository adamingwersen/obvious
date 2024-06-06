"use client";

import { useRouter } from "next/navigation";
import { signInWithProvider, signUp } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/use-toast";
import EmailAuthForm from "@/components/forms/email-auth-form";

export default function SignUpPage() {
  // TODO - route the user to home if they're already logged in
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (email: string, password: string) => {
    try {
      const res = await signUp(email, password);
      router.push("/auth/confirm");
    } catch (error) {
      toast({ title: "unable to sign up" });
      console.error("Error signing up", error);
    }
  };

  return (
    <div className="mx-auto flex h-full items-center justify-center">
      <div className="mx-auto flex flex-col items-center justify-center gap-2">
        <h1>Create an account</h1>
        <Button
          variant="outline"
          onClick={async () => {
            signInWithProvider("google");
          }}
          className="w-72 gap-4 rounded-sm"
        >
          <img className="size-4" src="/google_logo.png"></img>
          Sign up with Google
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            signInWithProvider("azure");
          }}
          className="w-72 gap-4 rounded-sm"
        >
          <img className="size-5" src="/Outlook_40x40.svg"></img>
          Sign up with Outlook
        </Button>
        <div className="flex w-72 flex-grow items-center justify-center">
          <hr className="flex-grow border border-gray-300" />
          <span className="px-4 text-xs text-gray-300">OR</span>
          <hr className=" flex-grow border border-gray-300" />
        </div>

        <EmailAuthForm authType="signup" onAuthSubmit={onSubmit} />
      </div>
    </div>
  );
}
