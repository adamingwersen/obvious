import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  return <div className="relative h-full">{children}</div>;
};

export default ProtectedLayout;
