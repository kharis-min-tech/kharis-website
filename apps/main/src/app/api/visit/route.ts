import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cleanVisitText, visitorInsert, type VisitorInsert } from "@/lib/visit-submission";
import { sendEmailSafely } from "../../../../../../shared/mailer";
import {
  notifyAddress,
  visitEmail,
  type BranchContact,
} from "../../../../../../shared/form-notifications";
import { guardFormSubmission } from "../../../../../../shared/form-guard";

type LocalVisit = VisitorInsert & { id: string; created_at: string };

let localWriteQueue: Promise<void> = Promise.resolve();

function saveLocalVisit(record: LocalVisit): Promise<void> {
  const save = localWriteQueue.then(async () => {
    const [{ mkdir, readFile, rename, writeFile }, { dirname, join }] = await Promise.all([
      import("node:fs/promises"),
      import("node:path"),
    ]);
    const file = join(process.cwd(), ".local-data", "visitors.json");
    await mkdir(dirname(file), { recursive: true });

    let records: LocalVisit[] = [];
    try {
      records = JSON.parse(await readFile(file, "utf8")) as LocalVisit[];
      if (!Array.isArray(records)) throw new Error("Local visitor store is not an array.");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }

    const temporaryFile = `${file}.${record.id}.tmp`;
    await writeFile(temporaryFile, JSON.stringify([...records, record], null, 2) + "\n", {
      encoding: "utf8",
      mode: 0o600,
    });
    await rename(temporaryFile, file);
  });

  localWriteQueue = save.then(
    () => undefined,
    () => undefined,
  );
  return save;
}

async function localVisitResponse(row: VisitorInsert) {
  const [{ randomUUID }] = await Promise.all([import("node:crypto")]);
  try {
    await saveLocalVisit({ ...row, id: randomUUID(), created_at: new Date().toISOString() });
  } catch (error) {
    console.error("Local development visitor save error:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to save your visit locally. Please try again." },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true, storage: "local-development" });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;

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
    site: "Main site",
  });
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // The publishable key, not a service-role key: `anon` may INSERT into
  // visitors and read nothing (supabase/migrations/003).
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !publishableKey) {
    if (process.env.NODE_ENV === "development") return localVisitResponse(parsed.row);
    console.error("Missing Supabase server environment variables");
    return NextResponse.json({ ok: false, error: "Server configuration error." }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error } = await supabase.from("visitors").insert(parsed.row);
    if (error) {
      console.error("Supabase visitor insert error:", error);
      if (process.env.NODE_ENV === "development") return localVisitResponse(parsed.row);
      return NextResponse.json(
        { ok: false, error: "Unable to save your visit. Please try again." },
        { status: 500 },
      );
    }

    // The visit is saved. Notifying the branch must never fail the request.
    const { data: branchRows } = await supabase.from("branches").select("name, contact_email");
    const to = notifyAddress(
      (branchRows ?? []) as BranchContact[],
      parsed.row.branch_name,
      process.env.FALLBACK_NOTIFY_EMAIL,
    );
    if (to) {
      const mail = visitEmail({
        name: parsed.row.name,
        email: parsed.row.email,
        phone: parsed.row.phone,
        branchName: parsed.row.branch_name,
        gathering: cleanVisitText(data.gathering, 160),
        children: data.children === true,
        site: "Main site",
      });
      await sendEmailSafely({ to, replyTo: parsed.row.email, ...mail });
    } else {
      console.warn("Visit saved with no branch inbox to notify.");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Supabase visitor request failed:", error);
    if (process.env.NODE_ENV === "development") return localVisitResponse(parsed.row);
    return NextResponse.json(
      { ok: false, error: "Unable to save your visit. Please try again." },
      { status: 500 },
    );
  }
}
