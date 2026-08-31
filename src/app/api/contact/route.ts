import { NextResponse } from "next/server";

const TOPICS = new Set([
  "Sunday visit",
  "Prayer",
  "Giving",
  "Pastoral",
  "General",
]);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
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
  const message = String(data.message ?? "").trim();

  if (!first || !last) {
    return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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

  return NextResponse.json({
    ok: true,
    received: { first, last, email, phone, topic, branch, messageLength: message.length },
  });
}
