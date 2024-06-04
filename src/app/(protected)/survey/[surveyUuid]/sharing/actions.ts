"use server";

import { api } from "@/trpc/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { type ShareFormFields } from "@/components/forms/schemas/share-form";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Resend } from "resend";
import { InviteRespondentEmailTemplate } from "@/components/email/invite-respondent";

const supabase = createServerActionClient(
  { cookies },
  { supabaseKey: process.env.SUPABASE_SERVICE_ROLE },
);

const resend = new Resend(process.env.RESEND_API_KEY);

const generateMagicLinkAsAdmin = async (email: string, surveyUuid: string) => {
  // Maybe move to lib/utils?
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: email,
    options: {
      redirectTo: `/respond/${surveyUuid}`,
    },
  });
  return { data, error };
};

export const handleCreateManyRespondents = async (data: ShareFormFields) => {
  await api.respondent.createMany(data.emails);
  revalidatePath(`/(protected)/survey/[surveyUuid]/sharing`, "page");
};

export const handleDeleteRespondent = async (
  email: string,
  surveyId: number,
) => {
  await api.respondent.delete({ email: email, surveyId: surveyId });
  revalidatePath(`/(protected)/survey/[surveyUuid]/sharing`, "page");
};

export const handleSendInviteEmailWithResend = async (
  email: string,
  surveyUuid: string,
) => {
  const { data, error } = await generateMagicLinkAsAdmin(email, surveyUuid);
  if (error) throw new Error(`Supabase: Can't generate magic link `, error);
  if (!data.properties?.action_link)
    throw new Error("Supabase: Couldnt generate magic link");
  const actionLink = data.properties.action_link;
  try {
    const { data, error } = await resend.emails.send({
      from: "Adam from Obvious <adam@obvious.earth>",
      to: email,
      subject: "You've been invited to a answer a Due Diligence Questionnaire",
      react: InviteRespondentEmailTemplate({
        email: email,
        actionLink: actionLink,
      }) as React.ReactElement,
    });
  } catch (error) {
    throw new Error(`Resend: Error while sending email to ${email}`);
  }
  revalidatePath(`/(protected)/survey/[surveyUuid]/sharing`, "page");
};

export const handleSendManyInviteEmailsWithResend = async (
  emails: string[],
  surveyUuid: string,
) => {
  function sendEmails(manyEmails: string[]): Promise<void[]> {
    if (manyEmails.length < 1) throw new Error(`Email: No emails submitted`);
    if (manyEmails.length > 5)
      throw new Error(`Email: Hold your horses. Max 5 emails at a time`);
    return Promise.all(
      manyEmails.map(async (email: string) => {
        const { data, error } = await generateMagicLinkAsAdmin(
          email,
          surveyUuid,
        );
        if (error)
          throw new Error(`Supabase: Can't generate magic link `, error);
        if (!data.properties?.action_link)
          throw new Error("Supabase: Couldnt generate magic link");
        const actionLink = data.properties.action_link;
        try {
          const { data, error } = await resend.emails.send({
            from: "Adam from Obvious <adam@obvious.earth>",
            to: email,
            subject:
              "You've been invited to a answer a Due Diligence Questionnaire",
            react: InviteRespondentEmailTemplate({
              email: email,
              actionLink: actionLink,
            }) as React.ReactElement,
          });
        } catch (error) {
          throw new Error(`Resend: Error while sending email to ${email}`);
        }
      }),
    );
  }
  await sendEmails(emails);
  revalidatePath(`/(protected)/survey/[surveyUuid]/sharing`, "page");
};
