import { createClient } from "@/server/supabase/server";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/");

  return (
    <main className="flex h-screen items-center bg-zinc-100">{children}</main>
  );
};

export default AuthLayout;
