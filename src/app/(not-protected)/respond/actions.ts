"use server";
import { verify } from "jsonwebtoken";

import { redirect } from "next/navigation";
// import { type ValidateRespondentFormFields } from "./page";
import { cookies } from "next/headers";
import { type RespondentWithUserJwt } from "@/types/respondent";

export const getRespondent = async () => {
  const respondentToken = cookies().get("respondent-identifier");
  if (!respondentToken) redirect(`/respond/rejected`);
  try {
    const decoded = verify(respondentToken.value, `${process.env.JWT_HASH}`);
    const respondentUser = (decoded as RespondentWithUserJwt).respondentUser;
    return respondentUser;
  } catch (err) {
    redirect(`/respond/rejected`);
  }
};
