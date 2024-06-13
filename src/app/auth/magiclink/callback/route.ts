import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const surveyUuid = searchParams.get("surveyUuid");
  const accessToken = searchParams.get("access_token");
  const expiresAt = searchParams.get("expires_at");
  const expiresIn = searchParams.get("expires_in");
  return NextResponse.redirect(`${origin}/respond/${surveyUuid}`);
}
