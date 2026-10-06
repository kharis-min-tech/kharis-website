import https from "https";
import { NextResponse } from "next/server";
import { SITE_WORKSPACE } from "@/lib/site";

const CATEGORIES = new Set([
  "Deliverance",
  "Education",
  "Family/Marriage",
  "Finances/Miracle Money",
  "Health/Healing",
  "Housing/Mortgage",
  "Job/Career",
  "Safe Passage/Protection",
  "Salvation",
  "Unusual Favour",
  "Other",
]);

function isCertError(error: unknown) {
  const code =
    (error as { cause?: { code?: string }; code?: string } | null)?.cause?.code ??
    (error as { code?: string } | null)?.code;
  return code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" || code === "CERT_UNTRUSTED";
}

function asString(value: unknown, max = 500) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function restPost(
  url: string,
  headers: Record<string, string>,
  payload: string,
): Promise<{ ok: boolean; status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = https.request(
      {
        hostname: parsed.hostname,
        path: `${parsed.pathname}${parsed.search}`,
        method: "POST",
        headers: {
          ...headers,
          "Content-Length": Buffer.byteLength(payload),
        },
        agent: new https.Agent({ rejectUnauthorized: false }),
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk as Buffer));
        res.on("end", () => {
          resolve({
            ok: (res.statusCode ?? 500) >= 200 && (res.statusCode ?? 500) < 300,
            status: res.statusCode ?? 500,
            body: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const firstName = asString(body.firstName, 80);
    const preferredName = asString(body.preferredName, 80);
    const lastName = asString(body.lastName, 80);
    const mobile = asString(body.mobile, 40);
    const category = asString(body.category, 80);
    const details = asString(body.details, 8000);
    const anonymous = asString(body.anonymous, 8);

    if (!firstName || !lastName || !category || !details || !anonymous) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 },
      );
    }

    if (!CATEGORIES.has(category)) {
      return NextResponse.json({ error: "Please choose a valid category." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase server environment variables");
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const displayName = preferredName || `${firstName} ${lastName}`;
    const shortDescription =
      details.length > 180 ? `${details.slice(0, 177).trim()}...` : details;

    const payload = JSON.stringify({
      name: displayName,
      phone: mobile || null,
      workspace: SITE_WORKSPACE,
      category,
      short_description: shortDescription,
      description: details,
      is_anonymous: anonymous === "Yes",
      is_published: false,
      is_featured: false,
      is_featured_giving: false,
    });

    const headers = {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };
    const url = `${supabaseUrl}/rest/v1/testimonies?select=id`;

    let result: { ok: boolean; status: number; body: string };
    try {
      const res = await fetch(url, { method: "POST", headers, body: payload });
      result = { ok: res.ok, status: res.status, body: await res.text() };
    } catch (error) {
      if (!isCertError(error)) throw error;
      result = await restPost(url, headers, payload);
    }

    if (!result.ok) {
      console.error("Supabase testimony insert error:", result.status, result.body);
      return NextResponse.json({ error: "Unable to submit testimony." }, { status: 500 });
    }

    let id: string | undefined;
    try {
      const parsed = JSON.parse(result.body) as { id?: string }[] | { id?: string };
      id = Array.isArray(parsed) ? parsed[0]?.id : parsed.id;
    } catch {
      id = undefined;
    }

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error("Testimony API error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
