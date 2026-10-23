import { NextResponse } from "next/server";
import { serverFetch } from "@/lib/server-fetch";
import { loadSermonCatalogue, searchCatalogue, sermonsByIds } from "@/lib/sermon-catalogue";
import { studioUserFromRequest } from "@/lib/studio-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const studio = await studioUserFromRequest(request);
  if (!studio) return NextResponse.json({ error: "Sign in again." }, { status: 401 });

  const url = new URL(request.url);
  const query = (url.searchParams.get("q") ?? "").trim().slice(0, 80);
  const ids = (url.searchParams.get("ids") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 40);

  try {
    const sermons = await loadSermonCatalogue(serverFetch);
    const matches = ids.length > 0 ? sermonsByIds(sermons, ids) : searchCatalogue(sermons, query);
    return NextResponse.json({ sermons: matches });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The sermon catalogue could not be loaded.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
