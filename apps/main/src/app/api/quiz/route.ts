import { NextResponse } from "next/server";
import { kharisApiConfigured, postForm, siteGet } from "@/lib/kharis-api";
import { QUIZ_BRANCHES, QUIZ_LANGUAGES } from "@/data/quiz";
import { sendEmailSafely } from "../../../../../../shared/mailer";
import {
  findBranch,
  notifyAddress,
  quizEmail,
  type BranchContact,
} from "../../../../../../shared/form-notifications";
import { guardFormSubmission } from "../../../../../../shared/form-guard";

const BRANCHES = new Set<string>(QUIZ_BRANCHES);
const LANGUAGES = new Set<string>(QUIZ_LANGUAGES.map((l) => l.code));

function clean(value: unknown, max: number) {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}

/**
 * Department quiz results. The quiz is anonymous: it records which branch, in
 * which language, matched which departments, and nothing about the person.
 */
export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const guard = await guardFormSubmission(request, data, "quiz");
  if (!guard.ok) {
    // A tripped honeypot gets a cheerful 200 and no row, so a bot learns nothing.
    if (guard.silent) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, error: guard.error }, { status: guard.status });
  }

  const branchName = clean(data.branch, 120);
  const language = clean(data.lang, 8) || "en";
  const departments = Array.isArray(data.departments)
    ? data.departments.slice(0, 3).map((d) => clean(d, 120))
    : [];

  if (!BRANCHES.has(branchName)) {
    return NextResponse.json({ ok: false, error: "Please choose a branch." }, { status: 400 });
  }
  if (!LANGUAGES.has(language)) {
    return NextResponse.json({ ok: false, error: "Unknown language." }, { status: 400 });
  }
  if (!departments.filter(Boolean).length) {
    return NextResponse.json({ ok: false, error: "No departments matched." }, { status: 400 });
  }

  if (!kharisApiConfigured) {
    console.error("Missing NEXT_PUBLIC_KHARIS_API_URL for quiz results");
    return NextResponse.json({ ok: false, error: "Server configuration error." }, { status: 500 });
  }

  try {
    const { data: branchRows } = await siteGet<BranchContact[]>("/branches");
    const branches = branchRows ?? [];
    const matched = findBranch(branches, branchName);

    const { error } = await postForm("/api/quiz", {
      branchId: matched?.id ?? "",
      branch: matched?.name ?? branchName,
      lang: language,
      departments: departments.filter(Boolean),
      site: "Main site",
    });

    if (error) {
      console.error("Kharis API quiz error:", error);
      return NextResponse.json(
        { ok: false, error: "Unable to save your result." },
        { status: 500 },
      );
    }

    // Saved. Notifying the branch must never fail the request.
    const to = notifyAddress(branches, branchName, process.env.FALLBACK_NOTIFY_EMAIL);
    if (to) {
      const mail = quizEmail({
        branchName: matched?.name ?? branchName,
        language,
        departments,
        site: "Main site",
      });
      await sendEmailSafely({ to, ...mail });
    } else {
      console.warn("Quiz result saved with no branch inbox to notify.");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Quiz result request failed:", error);
    return NextResponse.json({ ok: false, error: "Unable to save your result." }, { status: 500 });
  }
}
