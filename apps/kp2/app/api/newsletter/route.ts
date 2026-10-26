import { NextResponse } from "next/server";
import { supabaseInsert } from "@/lib/supabase";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const email = String(data.email ?? "")
    .trim()
    .toLowerCase()
    .slice(0, 254);
  if (!EMAIL.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }

  const result = await supabaseInsert(
    "newsletter_subscribers",
    { email, source: "kp2" },
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  if (!result.configured) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL for newsletter.");
    return NextResponse.json(
      { ok: false, error: "Subscriptions can't be saved from the site right now." },
      { status: 503 },
    );
  }
  if (!result.ok && result.status !== 409) {
    return NextResponse.json(
      { ok: false, error: "Unable to save that email. Please try again." },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
