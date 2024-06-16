import { NextResponse } from "next/server";
import { api } from "@/trpc/server";
import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const surveyUuid = searchParams.get("surveyUuid");
  const accessToken = searchParams.get("access_token");
  if (!surveyUuid || !accessToken)
    return NextResponse.redirect(`${origin}/respond/rejected`);

  // TODO: Fix expires
  // const expiresAt = searchParams.get("expires_at");
  // const expiresIn = searchParams.get("expires_in");

  const respondentUser =
    await api.surveyRespondent.findByAccessTokenAndSurveyUuid({
      surveyAccessToken: accessToken,
      surveyUuid: surveyUuid,
    });
  if (!respondentUser)
    return NextResponse.redirect(`${origin}/respond/rejected`);

  try {
    await api.surveyRespondent.updateFirstSeenAt({
      respondentUserId: respondentUser.respondentUserId,
      surveyId: respondentUser.surveyId,
    });
  } catch (error) {
    return NextResponse.redirect(`${origin}/respond/rejected`);
  }

  const token = jwt.sign(
    { respondentUser: respondentUser },
    `${process.env.JWT_HASH}`,
  );

  cookies().set("respondent-identifier", token, {
    secure: true,
  });

  return NextResponse.redirect(`${origin}/respond`);
}
