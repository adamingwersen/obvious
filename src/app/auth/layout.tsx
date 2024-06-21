import { createClient } from "@/server/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { api } from "@/trpc/server";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // if (!user) redirect("/auth");
  if (user) {
    const dbUser = await api.user.getByEmail({ email: user?.email ?? "" });

    if (dbUser !== undefined) redirect("/home");
  }

  return (
    <div className="flex w-full flex-row">
      <div className="relative mx-auto h-[100vh] w-1/2">
        <Image
          src="/backdrop-1-1x.png"
          alt="Outer Image"
          layout="fill"
          placeholder="blur"
          className="object-cover"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0MrD7DwAC3QGhainANwAAAABJRU5ErkJggg=="
        />
        <div className="absolute left-1/2 top-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <Image
            src="/obvious-text-logo-white.png"
            alt="Inner Image"
            layout="responsive"
            width={100}
            height={100}
            className="object-contains"
          />
        </div>
      </div>
      <div className="w-1/2">{children}</div>
    </div>
  );
};

export default AuthLayout;
