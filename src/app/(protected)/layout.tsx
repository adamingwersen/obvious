export const dynamic = "force-dynamic";

import Navbar from "@/components/navigation/navbar";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth"); // TODO: This should be DBUser not auth user

  return (
    <div className=" flex h-[100vh] flex-col">
      <Navbar user={user} />
      <div className="flex-grow p-6" style={{ height: "calc(100vh - 4rem)" }}>
        {children}
      </div>
    </div>
  );
};

export default ProtectedLayout;
