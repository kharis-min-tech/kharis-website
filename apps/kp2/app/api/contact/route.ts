import { NextResponse } from "next/server";
import { SITE_WORKSPACE } from "@/lib/site";
import { supabaseInsert, supabaseSelect } from "@/lib/supabase";
import { CONTACT_TOPICS, withSiteLine } from "@/lib/contact";
import { sendEmailSafely } from "../../../../../shared/mailer";
import {
  contactEmail,
  notifyAddress,
  type BranchContact,
} from "../../../../../shared/form-notifications";

const LIMITS = { name: 120, email: 254, phone: 40, branch: 120, message: 12000 } as const;
const TOPICS = new Set<string>(CONTACT_TOPICS.map((topic) => topic.value));
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max: number) {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parts = clean(data.name, LIMITS.name).split(/\s+/).filter(Boolean);
  const first = parts[0] ?? "";
  const last = parts.length > 1 ? parts.slice(1).join(" ") : first;
  const email = clean(data.email, LIMITS.email);
  const phone = clean(data.phone, LIMITS.phone);
  const topic = clean(data.topic, 40) || "General";
  const branch = clean(data.branch, LIMITS.branch);
  let message = clean(data.message, LIMITS.message);

  if (!first) {
    return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  }
  if (!EMAIL.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }
  if (message.length < 8) {
    return NextResponse.json(
      { ok: false, error: "Please add a short message so we know how to help." },
      { status: 400 },
    );
  }
  if (!TOPICS.has(topic)) {
    return NextResponse.json({ ok: false, error: "Please choose a topic." }, { status: 400 });
  }

  message = withSiteLine(message, "KP2");

  const branches = await supabaseSelect<BranchContact>(
    "branches",
    "select=id,name,contact_email",
    false,
  );
  const [match] = branch
    ? branches.filter((row) => row.name.trim().toLowerCase() === branch.trim().toLowerCase())
    : [];

  const result = await supabaseInsert(
    "contact_messages",
    {
      first_name: first,
      last_name: last,
      email,
      phone: phone || null,
      topic,
      branch_id: match?.id ?? null,
      branch_name: match?.name ?? (branch || null),
      message,
      workspace: SITE_WORKSPACE,
      status: "new",
    },
    // The publishable key, not a service-role key: `anon` may INSERT into
    // contact_messages and read nothing (supabase/migrations/003).
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  if (!result.configured) {
    console.error("Missing Supabase environment variables for contact.");
    return NextResponse.json(
      { ok: false, error: "Messages can't be sent from the site right now." },
      { status: 503 },
    );
  }
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "Unable to send your message. Please try again." },
      { status: 500 },
    );
  }
  // The message is saved. Notifying the branch must never fail the request.
  const branchName = match?.name ?? (branch || "");
  const to = notifyAddress(branches, branchName, process.env.FALLBACK_NOTIFY_EMAIL);
  if (to) {
    const mail = contactEmail({
      firstName: first,
      lastName: last,
      email,
      phone,
      topic,
      branchName,
      message,
      site: "KP2",
    });
    await sendEmailSafely({ to, replyTo: email, ...mail });
  } else {
    console.warn("Contact message saved with no branch inbox to notify.");
  }

  return NextResponse.json({ ok: true });
}
