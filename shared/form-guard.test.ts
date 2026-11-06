import { afterEach, describe, expect, it, vi } from "vitest";
import { HONEYPOT_FIELD, TURNSTILE_FIELD } from "./form-fields";
import {
  checkRateLimit,
  clientIp,
  guardFormSubmission,
  honeypotTripped,
  verifyTurnstile,
  type RateLimiter,
} from "./form-guard";

const SECRET = { TURNSTILE_SECRET: "test-secret" };

function request(headers: Record<string, string> = {}) {
  return new Request("https://kharis.org/api/contact", { method: "POST", headers });
}

function siteverify(body: Record<string, unknown>, ok = true) {
  return vi.fn(async () => new Response(JSON.stringify(body), { status: ok ? 200 : 500 }));
}

const allow: RateLimiter = { limit: async () => ({ success: true }) };
const deny: RateLimiter = { limit: async () => ({ success: false }) };

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("honeypotTripped", () => {
  it("ignores an absent or empty field, as a real visitor leaves it", () => {
    expect(honeypotTripped({})).toBe(false);
    expect(honeypotTripped({ [HONEYPOT_FIELD]: "" })).toBe(false);
    expect(honeypotTripped({ [HONEYPOT_FIELD]: "   " })).toBe(false);
  });

  it("catches a filled field", () => {
    expect(honeypotTripped({ [HONEYPOT_FIELD]: "Acme Ltd" })).toBe(true);
  });
});

describe("clientIp", () => {
  it("prefers CF-Connecting-IP, which Cloudflare sets and clients cannot forge", () => {
    const headers = { "cf-connecting-ip": "203.0.113.7", "x-forwarded-for": "1.2.3.4" };
    expect(clientIp(request(headers))).toBe("203.0.113.7");
  });

  it("falls back to the first X-Forwarded-For entry, then to empty", () => {
    expect(clientIp(request({ "x-forwarded-for": "198.51.100.9, 10.0.0.1" }))).toBe("198.51.100.9");
    expect(clientIp(request())).toBe("");
  });
});

describe("checkRateLimit", () => {
  it("allows when no limiter is bound, so local dev is unaffected", async () => {
    await expect(checkRateLimit("contact:1.2.3.4", null)).resolves.toBe(true);
  });

  it("reflects the limiter's verdict", async () => {
    await expect(checkRateLimit("contact:1.2.3.4", allow)).resolves.toBe(true);
    await expect(checkRateLimit("contact:1.2.3.4", deny)).resolves.toBe(false);
  });

  it("allows when the limiter itself errors, rather than taking the form down", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const broken: RateLimiter = {
      limit: async () => {
        throw new Error("binding unavailable");
      },
    };
    await expect(checkRateLimit("contact:1.2.3.4", broken)).resolves.toBe(true);
  });
});

describe("verifyTurnstile", () => {
  it("passes straight through when no secret is configured", async () => {
    const fetchMock = siteverify({ success: true });
    vi.stubGlobal("fetch", fetchMock);
    await expect(verifyTurnstile("", "", "contact", {})).resolves.toEqual({
      ok: true,
      reason: "not-configured",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("requires a token once a secret is set", async () => {
    const result = await verifyTurnstile(undefined, "", "contact", SECRET);
    expect(result).toEqual({ ok: false, reason: "missing-token" });
  });

  it("rejects an implausibly long token without calling siteverify", async () => {
    const fetchMock = siteverify({ success: true });
    vi.stubGlobal("fetch", fetchMock);
    const result = await verifyTurnstile("x".repeat(2049), "", "contact", SECRET);
    expect(result.ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("accepts a good token and forwards the visitor's IP", async () => {
    const fetchMock = siteverify({ success: true, action: "contact", hostname: "kharis.org" });
    vi.stubGlobal("fetch", fetchMock);
    await expect(verifyTurnstile("tok", "203.0.113.7", "contact", SECRET)).resolves.toEqual({
      ok: true,
    });
    const body = fetchMock.mock.calls[0][1].body as URLSearchParams;
    expect(body.get("remoteip")).toBe("203.0.113.7");
    expect(body.get("secret")).toBe("test-secret");
  });

  it("reports Cloudflare's error codes when the token is refused", async () => {
    vi.stubGlobal("fetch", siteverify({ success: false, "error-codes": ["timeout-or-duplicate"] }));
    await expect(verifyTurnstile("tok", "", "contact", SECRET)).resolves.toEqual({
      ok: false,
      reason: "timeout-or-duplicate",
    });
  });

  it("rejects a token minted for a different surface", async () => {
    vi.stubGlobal("fetch", siteverify({ success: true, action: "quiz" }));
    const result = await verifyTurnstile("tok", "", "contact", SECRET);
    expect(result).toEqual({ ok: false, reason: "action-mismatch:quiz" });
  });

  it("enforces the hostname allowlist only when one is configured", async () => {
    vi.stubGlobal("fetch", siteverify({ success: true, hostname: "evil.example" }));
    await expect(verifyTurnstile("tok", "", "contact", SECRET)).resolves.toEqual({ ok: true });

    vi.stubGlobal("fetch", siteverify({ success: true, hostname: "evil.example" }));
    await expect(
      verifyTurnstile("tok", "", "contact", { ...SECRET, TURNSTILE_HOSTNAMES: "kharis.org" }),
    ).resolves.toEqual({ ok: false, reason: "hostname-mismatch:evil.example" });
  });

  it("fails closed when siteverify cannot be reached", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );
    const result = await verifyTurnstile("tok", "", "contact", SECRET);
    expect(result).toEqual({ ok: false, reason: "siteverify-unreachable" });
  });

  it("fails closed on a non-2xx from siteverify", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", siteverify({ success: true }, false));
    const result = await verifyTurnstile("tok", "", "contact", SECRET);
    expect(result.ok).toBe(false);
  });
});

describe("guardFormSubmission", () => {
  it("drops a honeypot submission silently, so the bot learns nothing", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = await guardFormSubmission(request(), { [HONEYPOT_FIELD]: "bot" }, "contact", {
      env: {},
      limiter: allow,
    });
    expect(result).toEqual({ ok: false, silent: true });
  });

  it("returns 429 when the rate limit is hit", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = await guardFormSubmission(request(), {}, "visit", { env: {}, limiter: deny });
    expect(result).toMatchObject({ ok: false, status: 429 });
  });

  it("returns 403 when Turnstile refuses", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      siteverify({ success: false, "error-codes": ["invalid-input-response"] }),
    );
    const result = await guardFormSubmission(request(), { [TURNSTILE_FIELD]: "tok" }, "contact", {
      env: SECRET,
      limiter: allow,
    });
    expect(result).toMatchObject({ ok: false, status: 403 });
  });

  it("lets a clean submission through", async () => {
    vi.stubGlobal("fetch", siteverify({ success: true, action: "quiz" }));
    const result = await guardFormSubmission(request(), { [TURNSTILE_FIELD]: "tok" }, "quiz", {
      env: SECRET,
      limiter: allow,
    });
    expect(result).toEqual({ ok: true });
  });
});
