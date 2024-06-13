"use server";

import { api } from "@/trpc/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { type ShareFormFields } from "@/components/forms/schemas/share-form";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Resend } from "resend";
import { InviteRespondentEmailTemplate } from "@/components/email/invite-respondent";
import { type UserModel } from "@/server/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

const generateMagicLinkAsAdmin = async (email: string, surveyUuid: string) => {
  const supabase = createServerActionClient(
    { cookies },
    { supabaseKey: process.env.SUPABASE_SERVICE_ROLE },
  );
  // Maybe move to lib/utils?
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: email,
    options: {
      redirectTo: `/respond/${surveyUuid}`,
    },
  });
  const accessToken = data.properties?.hashed_token;
  const expiresIn = 3600;
  const expiresAt = Math.floor((Date.now() + expiresIn) / 1000);
  try {
    const data = {
      data: {
        access_token: accessToken,
        expires_in: expiresIn,
        expires_at: expiresAt,
        action_link: `${process.env.BASE_URL?.includes("localhost") ? "http://" : ""}${process.env.BASE_URL}/auth/magiclink/callback?surveyUuid=${surveyUuid}&access_token=${accessToken}&expires_at=${expiresAt}&expires_in=${expiresIn}`,
      },
      error: undefined,
    };
    return data;
  } catch (error) {
    return { data: { action_link: undefined, access_token: undefined }, error };
  }
};

export const handleCreateManyRespondentsAndSendEmails = async (
  data: ShareFormFields,
  surveyUuid: string,
) => {
  //create users
  const newUsers = await api.user.createManyByEmail(data.emails);

  const surveyId = data.emails[0]?.surveyId;
  if (!surveyId) throw new Error("Why didnt you give me a surveyid?");

  const payload = newUsers.map((u) => {
    const respondentUserId: number = u.id;
    const sameSurveyId: number = surveyId;
    return { respondentUserId: respondentUserId, surveyId: sameSurveyId };
  });
  await api.surveyRespondent.createMany(payload);
  // const emailList = newUsers.map((u) => u.email);
  await handleSendManyInviteEmailsWithResend(newUsers, surveyUuid, surveyId);
  revalidatePath(`/(protected)/survey/[surveyUuid]/sharing`, "page");
};

export const handleDeleteRespondent = async (
  userId: number,
  surveyId: number,
) => {
  await api.surveyRespondent.delete({
    respondentUserId: userId,
    surveyId: surveyId,
  });
  revalidatePath(`/(protected)/survey/[surveyUuid]/sharing`, "page");
};

export const handleSendManyInviteEmailsWithResend = async (
  users: UserModel[],
  surveyUuid: string,
  surveyId: number,
) => {
  function sendEmails(newUsers: UserModel[]): Promise<void[]> {
    if (newUsers.length < 1) throw new Error(`Email: No emails submitted`);
    if (newUsers.length > 5)
      throw new Error(`Email: Hold your horses. Max 5 emails at a time`);
    return Promise.all(
      newUsers.map(async (user: UserModel) => {
        const { data, error } = await generateMagicLinkAsAdmin(
          user.email,
          surveyUuid,
        );
        if (error)
          throw new Error(`Supabase: Can't generate magic link `, error);
        if (!data.action_link)
          throw new Error("Supabase: Couldnt generate magic link");
        if (!data.access_token)
          throw new Error(
            "Internal: Couldn't fetch access token from data object",
          );
        const actionLink = data.action_link;
        const accessToken = data.access_token;
        try {
          const { data, error } = await resend.emails.send({
            from: "Adam from Obvious <adam@obvious.earth>",
            to: user.email,
            subject:
              "You've been invited to a answer a Due Diligence Questionnaire",
            react: InviteRespondentEmailTemplate({
              email: user.email,
              actionLink: actionLink,
            }) as React.ReactElement,
          });
          await api.surveyRespondent.upsertAccessToken({
            respondentUserId: user.id,
            surveyId: surveyId,
            surveyAccessToken: accessToken,
          });
        } catch (error) {
          throw new Error(`Resend: Error while sending email to ${user.email}`);
        }
      }),
    );
  }
  await sendEmails(users);
  revalidatePath(`/(protected)/survey/[surveyUuid]/sharing`, "page");
};

// export const handleSendInviteEmailWithResend = async (
//   email: string,
//   surveyUuid: string,
// ) => {
//   const { data, error } = await generateMagicLinkAsAdmin(email, surveyUuid);
//   if (error) throw new Error(`Supabase: Can't generate magic link `, error);
//   if (!data.action_link)
//     throw new Error("Supabase: Couldnt generate magic link");
//   if (!data.access_token)
//     throw new Error("Internal: Couldn't fetch access token from data object");

//   const actionLink = data.action_link;
//   const accessToken = data.access_token;
//   try {
//     const { error } = await resend.emails.send({
//       from: "Adam from Obvious <adam@obvious.earth>",
//       to: email,
//       subject: "You've been invited to a answer a Due Diligence Questionnaire",
//       react: InviteRespondentEmailTemplate({
//         email: email,
//         actionLink: actionLink,
//       }) as React.ReactElement,
//     });
//   } catch (error) {
//     throw new Error(`Resend: Error while sending email to ${email}`);
//   }
//   await api.respondent.upsertAccessToken({ email, surveyUuid, accessToken });
//   revalidatePath(`/(protected)/survey/[surveyUuid]/sharing`, "page");
// };
