import Navigation from "@/components/ui/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  return (
    <div className=" flex h-[100vh] flex-col">
      <Navigation />
      <div className="flex h-full w-full flex-row items-stretch justify-start p-6">
        {children}
      </div>
    </div>
  );
};

export default ProtectedLayout;
