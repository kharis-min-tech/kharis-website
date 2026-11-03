/**
 * Transactional email via AWS SES v2 (REST), signed with aws4fetch.
 *
 * This mirrors the mailers in the kairos project (packages/utils/src/mailer.ts)
 * and venue-checkin (src/mailer.js) so all three send from the same verified
 * identity, noreply@kharis.org. aws4fetch is used instead of the AWS SDK
 * because it is a few kilobytes and runs unmodified on Workers.
 *
 * Credentials come from `process.env`, which OpenNext populates from the
 * Worker's secrets and vars on every request. When the AWS keys are absent —
 * local dev without SES — sending is skipped with a log line instead of
 * throwing, so every form still works end to end on `npm run dev`.
 */

import { AwsClient } from "aws4fetch";

const DEFAULT_REGION = "eu-west-2";
const DEFAULT_FROM = '"Kharis Church" <noreply@kharis.org>';

export type MailerEnv = {
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_REGION?: string;
  EMAIL_FROM?: string;
  SES_CONFIGURATION_SET?: string;
};

export type EmailMessage = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  /** Set to the enquirer's address so a branch can reply straight to them. */
  replyTo?: string | string[];
};

let client: AwsClient | null = null;
let clientKey = "";

function readEnv(
  env?: MailerEnv,
): Required<Pick<MailerEnv, "AWS_REGION" | "EMAIL_FROM">> & MailerEnv {
  const source = env ?? (process.env as MailerEnv);
  return {
    AWS_ACCESS_KEY_ID: source.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: source.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: source.AWS_REGION || DEFAULT_REGION,
    EMAIL_FROM: source.EMAIL_FROM || DEFAULT_FROM,
    SES_CONFIGURATION_SET: source.SES_CONFIGURATION_SET,
  };
}

function awsClient(env: MailerEnv & { AWS_REGION: string }): AwsClient | null {
  const accessKeyId = env.AWS_ACCESS_KEY_ID || "";
  const secretAccessKey = env.AWS_SECRET_ACCESS_KEY || "";
  if (!accessKeyId || !secretAccessKey) return null;

  // The client holds no request state, so it is safe to reuse across requests
  // on a warm isolate. Rotate it if the key or region changes.
  const key = `${accessKeyId}:${env.AWS_REGION}`;
  if (client && clientKey === key) return client;
  client = new AwsClient({ accessKeyId, secretAccessKey, region: env.AWS_REGION, service: "ses" });
  clientKey = key;
  return client;
}

/** True when SES credentials are present. Callers use this to stay quiet in local dev. */
export function isMailerLive(env?: MailerEnv): boolean {
  const e = readEnv(env);
  return Boolean(e.AWS_ACCESS_KEY_ID && e.AWS_SECRET_ACCESS_KEY);
}

/**
 * Send one email. Resolves `false` when SES is not configured (local dev) and
 * throws on an SES error, so callers can log without failing the visitor's
 * request — the form submission is already saved by the time this runs.
 */
export async function sendEmail(message: EmailMessage, env?: MailerEnv): Promise<boolean> {
  const e = readEnv(env);
  const aws = awsClient(e as MailerEnv & { AWS_REGION: string });
  if (!aws) {
    console.log(
      `Email (dev mode - AWS creds absent, not sent): to=${String(message.to)} subject=${message.subject}`,
    );
    return false;
  }

  const body: Record<string, unknown> = {
    FromEmailAddress: e.EMAIL_FROM,
    Destination: { ToAddresses: Array.isArray(message.to) ? message.to : [message.to] },
    Content: {
      Simple: {
        Subject: { Data: message.subject, Charset: "UTF-8" },
        Body: {
          Html: { Data: message.html, Charset: "UTF-8" },
          ...(message.text ? { Text: { Data: message.text, Charset: "UTF-8" } } : {}),
        },
      },
    },
  };
  if (message.replyTo) {
    body.ReplyToAddresses = Array.isArray(message.replyTo) ? message.replyTo : [message.replyTo];
  }
  if (e.SES_CONFIGURATION_SET) body.ConfigurationSetName = e.SES_CONFIGURATION_SET;

  const res = await aws.fetch(
    `https://email.${e.AWS_REGION}.amazonaws.com/v2/email/outbound-emails`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`SES send failed (${res.status}): ${detail}`);
  }
  return true;
}

/**
 * Send without ever rejecting. Every form route uses this: the row is already
 * written, so a bounced notification must not turn the visitor's submission
 * into an error. Failures are logged for the Workers dashboard instead.
 */
export async function sendEmailSafely(message: EmailMessage, env?: MailerEnv): Promise<boolean> {
  try {
    return await sendEmail(message, env);
  } catch (error) {
    console.error("Notification email failed:", error);
    return false;
  }
}
