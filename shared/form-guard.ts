/**
 * Three cheap defences in front of every public form, in increasing cost to an
 * attacker: a honeypot field, a per-IP rate limit, and Cloudflare Turnstile.
 *
 * What this protects is the email path, not the database. The Supabase
 * publishable key is public by design, so anyone can POST rows straight to
 * PostgREST; nothing here changes that. What it does stop is a bot turning a
 * contact form into a mail cannon aimed at the branch inboxes, which would put
 * the shared noreply@kharis.org SES reputation at risk for kairos and
 * venue-checkin too.
 *
 * Each layer is inert until configured, so local development and previews keep
 * working: no Turnstile sitekey means no widget and no verification, and no
 * rate-limit binding means no limiting.
 */

import { HONEYPOT_FIELD, TURNSTILE_FIELD, type FormAction } from "./form-fields";

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const SITEVERIFY_TIMEOUT_MS = 10_000;
const MAX_TOKEN_LENGTH = 2048;

export type GuardEnv = {
  TURNSTILE_SECRET?: string;
  /** Comma-separated hostnames the widget may be served from. Empty = any. */
  TURNSTILE_HOSTNAMES?: string;
};

/** A Cloudflare rate-limiting binding (`ratelimits` in wrangler.jsonc). */
export type RateLimiter = { limit(options: { key: string }): Promise<{ success: boolean }> };

export type GuardResult =
  /** Carry on with the submission. */
  | { ok: true }
  /** Honeypot: answer as though it worked, but do nothing. */
  | { ok: false; silent: true }
  /** Refuse, with something the visitor can act on. */
  | { ok: false; silent?: false; status: number; error: string };

/**
 * The visitor's IP. Cloudflare sets CF-Connecting-IP and strips any
 * client-supplied copy, so it is trustworthy here in a way X-Forwarded-For
 * is not.
 */
export function clientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    ""
  );
}

/** True when the hidden field came back filled, which only a bot does. */
export function honeypotTripped(data: Record<string, unknown>): boolean {
  const value = data[HONEYPOT_FIELD];
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * The rate-limit binding, when the Worker has one. Resolved lazily so this
 * module stays importable from `next dev`, where there is no Cloudflare
 * context at all.
 */
async function rateLimiter(): Promise<RateLimiter | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const env = getCloudflareContext().env as unknown as {
      FORM_RATE_LIMITER?: RateLimiter;
    };
    return env?.FORM_RATE_LIMITER ?? null;
  } catch {
    return null;
  }
}

/**
 * Approximate, per-Cloudflare-location limiting — bursts can slip past, which
 * is fine here. The goal is to blunt a flood, not to meter an API.
 */
export async function checkRateLimit(key: string, limiter?: RateLimiter | null): Promise<boolean> {
  const limit = limiter ?? (await rateLimiter());
  if (!limit) return true;
  try {
    const { success } = await limit.limit({ key });
    return success;
  } catch (error) {
    // A limiter that errors must not take the form down with it.
    console.error("Rate limit check failed:", error);
    return true;
  }
}

type SiteverifyResponse = {
  success?: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

/**
 * Canonical server-side Turnstile check. Returns `{ ok: true }` untouched when
 * no secret is configured; otherwise a token is required and must come back
 * successful, for this action, from an approved hostname.
 *
 * Fails closed if siteverify cannot be reached: a verification step that opens
 * the gate whenever Cloudflare has a bad minute is not a verification step.
 */
export async function verifyTurnstile(
  token: unknown,
  ip: string,
  action: FormAction,
  env: GuardEnv = process.env as GuardEnv,
): Promise<{ ok: boolean; reason?: string }> {
  const secret = env.TURNSTILE_SECRET;
  if (!secret) return { ok: true, reason: "not-configured" };

  if (typeof token !== "string" || token.length === 0 || token.length > MAX_TOKEN_LENGTH) {
    return { ok: false, reason: "missing-token" };
  }

  let result: SiteverifyResponse;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const response = await fetch(SITEVERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(SITEVERIFY_TIMEOUT_MS),
      body,
    });
    if (!response.ok) throw new Error(`siteverify ${response.status}`);
    result = (await response.json()) as SiteverifyResponse;
  } catch (error) {
    console.error("Turnstile siteverify unreachable:", error);
    return { ok: false, reason: "siteverify-unreachable" };
  }

  if (!result.success) {
    return { ok: false, reason: (result["error-codes"] ?? []).join(",") || "rejected" };
  }
  if (result.action && result.action !== action) {
    return { ok: false, reason: `action-mismatch:${result.action}` };
  }

  const allowed = (env.TURNSTILE_HOSTNAMES ?? "")
    .split(",")
    .map((hostname) => hostname.trim())
    .filter(Boolean);
  if (allowed.length > 0 && !allowed.includes(result.hostname ?? "")) {
    return { ok: false, reason: `hostname-mismatch:${result.hostname ?? ""}` };
  }

  return { ok: true };
}

/**
 * Run all three checks for one submission. Call it immediately after parsing
 * the body and before touching the database.
 */
export async function guardFormSubmission(
  request: Request,
  data: Record<string, unknown>,
  action: FormAction,
  options: { env?: GuardEnv; limiter?: RateLimiter | null } = {},
): Promise<GuardResult> {
  if (honeypotTripped(data)) {
    // Answer 200 anyway. A bot that learns it was caught just tries again
    // without the field.
    console.warn(`Honeypot tripped on ${action}; submission dropped.`);
    return { ok: false, silent: true };
  }

  const ip = clientIp(request);
  const allowed = await checkRateLimit(`${action}:${ip || "unknown"}`, options.limiter);
  if (!allowed) {
    console.warn(`Rate limit hit on ${action} from ${ip || "unknown ip"}.`);
    return {
      ok: false,
      status: 429,
      error: "That's a few too many in a row. Give it a minute and try again.",
    };
  }

  const verdict = await verifyTurnstile(data[TURNSTILE_FIELD], ip, action, options.env);
  if (!verdict.ok) {
    console.warn(`Turnstile rejected a ${action} submission: ${verdict.reason}`);
    return {
      ok: false,
      status: 403,
      error: "We couldn't verify that submission. Please refresh the page and try again.",
    };
  }

  return { ok: true };
}
