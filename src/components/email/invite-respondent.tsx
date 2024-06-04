import * as React from "react";

import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface InviteRespondentEmailTemplateProps {
  email: string;
  actionLink: string;
}
export const InviteRespondentEmailTemplate = ({
  actionLink,
}: InviteRespondentEmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>Action Required: Complete Due Diligence Questionnaire</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            src={`https://vmqekjcnotarvkhsgdiy.supabase.co/storage/v1/object/public/assets/obvious-email-sticker.png?t=2024-06-04T09%3A34%3A04.303Z`}
            alt="Obvious"
            width={92}
            height={36.4}
          />
          <Hr style={hr} />
          <Text style={paragraph}>
            As part of your ongoing partnership with XXX, we kindly request that
            you complete a due diligence questionnaire. This process is
            essential for maintaining compliance and ensuring the integrity of
            our business relationship.
          </Text>
          <Text style={paragraph}>
            Please complete the questionnaire at your earliest convenience.
          </Text>
          <Button style={button} href={actionLink}>
            COMPLETE QUESTIONNAIRE
          </Button>
          <Hr style={hr} />
          <Text style={paragraph}>
            If you have any questions, please check our{" "}
            <Link style={anchor} href="https://obvious.earth/docs">
              Q&A
            </Link>{" "}
            or reach out directly to <b>info@obvious.earth</b>
          </Text>
          <Text style={paragraph}>
            Once you&apos;ve completed the questionnaire, you&apos;ll be able to
            save your answers and respond to other such questionnaires from
            other partners on the
            <Link style={anchor} href="https://obvious.earth">
              {" "}
              Obvious platform.
            </Link>
          </Text>
          <Text style={paragraph}>
            We&apos;ll be here to help you with any step along the way. You can
            find answers to most questions and get in touch with us on our{" "}
            <Link style={anchor} href="https://support.obvious.earth/">
              support site
            </Link>
            .
          </Text>
          <Text style={paragraph}>— The Obvious team</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Obvious, Slagteboderne 3, 1711 Copenhagen V
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default InviteRespondentEmailTemplate;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const paragraph = {
  color: "#525f7f",

  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const anchor = {
  color: "#556cd6",
};

const button = {
  backgroundColor: "#404389",
  borderRadius: "0px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "10px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
