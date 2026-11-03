import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { QUIZ_BRANCHES, QUIZ_LANGUAGES } from "@/data/quiz";
import { sendEmailSafely } from "../../../../../../shared/mailer";
import {
  findBranch,
  notifyAddress,
  quizEmail,
  type BranchContact,
} from "../../../../../../shared/form-notifications";

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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // The publishable key, not a service-role key: `anon` may INSERT into
  // quiz_results and read nothing (supabase/migrations/003).
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !publishableKey) {
    console.error("Missing Supabase environment variables for quiz results");
    return NextResponse.json({ ok: false, error: "Server configuration error." }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: branchRows } = await supabase.from("branches").select("id, name, contact_email");
    const branches = (branchRows ?? []) as BranchContact[];
    const matched = findBranch(branches, branchName);

    const { error } = await supabase.from("quiz_results").insert({
      branch_id: matched?.id ?? null,
      branch_name: matched?.name ?? branchName,
      language,
      department_1: departments[0] || null,
      department_2: departments[1] || null,
      department_3: departments[2] || null,
      site: "Main site",
      workspace: "kharis",
    });

    if (error) {
      console.error("Supabase quiz insert error:", error);
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
