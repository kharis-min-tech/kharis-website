import { NextResponse } from "next/server";
import { getKharisEvents } from "@/lib/kharis-events";

export async function GET() {
  const events = await getKharisEvents();
  return NextResponse.json({ events });
}
