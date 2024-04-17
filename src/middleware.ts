import { updateSession } from "@/server/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
export const config = {
  matcher: ["/", "/((?!_next|_vercel|.*\\..*).*)"],
};
