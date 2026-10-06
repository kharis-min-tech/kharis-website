import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isGraceTicketId } from "@/lib/grace-handoff";

const TOPICS = new Set([
  "Sunday visit",
  "Prayer",
  "Giving",
  "Pastoral",
  "General",
  "Chat follow-up",
  "Baptism",
]);

const MAX_TICKET = 64;
const MAX_TRANSCRIPT = 6000;

function sanitizeTicket(raw: unknown): string {
  const t = String(raw ?? "").trim().toUpperCase();
  if (!t || t.length > MAX_TICKET) return "";
  if (!isGraceTicketId(t)) return "";
  return t;
}

function sanitizeTranscript(raw: unknown): string {
  return String(raw ?? "")
    .trim()
    .slice(0, MAX_TRANSCRIPT);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const data = body as Record<string, unknown>;
  const nameParts = String(data.name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  let first = String(data.first ?? "").trim();
  let last = String(data.last ?? "").trim();
  if (!first && nameParts[0]) first = nameParts[0];
  if (!last && nameParts.length === 1) last = nameParts[0] ?? "";
  if (!last && nameParts.length > 1) last = nameParts.slice(1).join(" ");
  const email = String(data.email ?? "").trim();
  const phone = String(data.phone ?? "").trim();
  const topic = String(data.topic ?? "General").trim();
  const branch = String(data.branch ?? "").trim();
  let message = String(data.message ?? "").trim();
  const chatTicket = sanitizeTicket(data.chatTicket);
  const chatTranscript = sanitizeTranscript(data.chatTranscript);

  if (chatTicket && !message.includes("--- Grace chat handoff ---")) {
    const staffBlock = [
      `--- Grace chat handoff ---`,
      `Ticket: ${chatTicket}`,
      chatTranscript ? `Transcript:\n${chatTranscript}` : null,
      `--- end handoff ---`,
    ]
      .filter(Boolean)
      .join("\n");
    message = `${message}\n\n${staffBlock}`.trim();
  }

  if (!first || !last) {
    return NextResponse.json(
      { ok: false, error: "Please enter your name." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email." },
      { status: 400 },
    );
  }
  if (message.length < 8) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please add a short message so we know how to help.",
      },
      { status: 400 },
    );
  }
  if (!TOPICS.has(topic)) {
    return NextResponse.json(
      { ok: false, error: "Please choose a topic." },
      { status: 400 },
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase server environment variables");
    return NextResponse.json(
      { ok: false, error: "Server configuration error." },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data: row, error } = await supabase
    .from("contact_messages")
    .insert({
      first_name: first,
      last_name: last,
      email,
      phone: phone || null,
      topic,
      branch: branch || null,
      message,
      workspace: "kharis",
      status: "new",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Supabase contact insert error:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to send your message. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    id: row.id,
    received: {
      first,
      last,
      email,
      phone,
      topic,
      branch,
      messageLength: message.length,
    },
  });
}
