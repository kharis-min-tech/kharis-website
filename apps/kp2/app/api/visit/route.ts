import { NextResponse } from "next/server";
import { supabaseInsert } from "@/lib/supabase";
import { cleanVisitText, visitorInsert } from "@/lib/visit-submission";

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
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

  const result = await supabaseInsert(
    "visitors",
    parsed.row,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  if (!result.configured) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL for visits.");
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
  return NextResponse.json({ ok: true });
}
