import { NextResponse } from "next/server";
import { postForm, siteGet } from "@/lib/kharis-api";
import { cleanVisitText, visitorInsert } from "@/lib/visit-submission";
import { sendEmailSafely } from "../../../../../shared/mailer";
import {
  notifyAddress,
  visitEmail,
  type BranchContact,
} from "../../../../../shared/form-notifications";
import { guardFormSubmission } from "../../../../../shared/form-guard";

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const guard = await guardFormSubmission(request, data, "visit");
  if (!guard.ok) {
    // A tripped honeypot gets a cheerful 200 and no row, so a bot learns nothing.
    if (guard.silent) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, error: guard.error }, { status: guard.status });
  }

  const parsed = visitorInsert({
    name: cleanVisitText(data.name, 120),
    email: cleanVisitText(data.email, 254),
    phone: cleanVisitText(data.phone, 40),
    branch: cleanVisitText(data.branch, 120),
    gathering: cleanVisitText(data.gathering, 160),
    children: data.children === true,
    consent: data.consent === true,
    site: "KP2",
  });
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  const result = await postForm("/api/visitors", {
    name: parsed.row.name,
    email: parsed.row.email,
    phone: parsed.row.phone ?? "",
    branch: cleanVisitText(data.branch, 120),
    gathering: cleanVisitText(data.gathering, 160),
    children: data.children === true,
    consent: true,
    site: "KP2",
  });
  if (!result.configured) {
    console.error("Missing NEXT_PUBLIC_KHARIS_API_URL for visits.");
    return NextResponse.json(
      { ok: false, error: "Visits can't be saved from the site right now." },
      { status: 503 },
    );
  }
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "Unable to save your visit. Please try again." },
      { status: 500 },
    );
  }
  // The visit is saved. Notifying the branch must never fail the request.
  const branches = (await siteGet<BranchContact[]>("/branches", false)) ?? [];
  const to = notifyAddress(branches, parsed.row.branch_name, process.env.FALLBACK_NOTIFY_EMAIL);
  if (to) {
    const mail = visitEmail({
      name: parsed.row.name,
      email: parsed.row.email,
      phone: parsed.row.phone,
      branchName: parsed.row.branch_name,
      gathering: cleanVisitText(data.gathering, 160),
      children: data.children === true,
      site: "KP2",
    });
    await sendEmailSafely({ to, replyTo: parsed.row.email, ...mail });
  } else {
    console.warn("Visit saved with no branch inbox to notify.");
  }

  return NextResponse.json({ ok: true });
}
