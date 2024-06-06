"use client";

import { useRouter } from "next/navigation";
import { signInWithPassword, signInWithProvider } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/use-toast";
import EmailAuthForm from "@/components/forms/email-auth-form";

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (email: string, password: string) => {
    try {
      const res = await signInWithPassword(email, password);
      router.push("/home");
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
            signInWithProvider("google");
          }}
          variant="outline"
          className="w-72 gap-4 rounded-sm"
        >
          <img className="size-4" src="/google_logo.png"></img>
          Sign in with Google
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            signInWithProvider("azure");
          }}
          className="w-72 gap-4 rounded-sm"
        >
          <img className="size-5" src="/Outlook_40x40.svg"></img>
          Sign in with Outlook
        </Button>
        <div className="flex w-72 flex-grow items-center justify-center">
          <hr className="flex-grow border border-gray-300" />
          <span className="px-4 text-sm text-gray-300">OR</span>
          <hr className=" flex-grow border border-gray-300" />
        </div>

        <EmailAuthForm authType="login" onAuthSubmit={onSubmit} />
      </div>
    </div>
  );
}
