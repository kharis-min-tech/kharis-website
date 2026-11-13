import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  apiErrorMessage,
  deleteStudioUser,
  getStudioMe,
  kharisApiUrl,
  listStudioUsers,
} from "./studio-api";

const { getSession } = vi.hoisted(() => ({ getSession: vi.fn() }));

vi.mock("./supabase", () => ({
  getSupabase: () => ({ auth: { getSession } }),
}));

function reply(status: number, body: unknown) {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_KHARIS_API_URL", "https://api.example.org/");
  vi.stubGlobal("fetch", fetchMock);
  getSession.mockResolvedValue({ data: { session: { access_token: "token-123" } } });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  fetchMock.mockReset();
  getSession.mockReset();
});

describe("kharisApiUrl", () => {
  it("drops trailing slashes and spaces", () => {
    vi.stubEnv("NEXT_PUBLIC_KHARIS_API_URL", "  https://api.example.org// ");
    expect(kharisApiUrl()).toBe("https://api.example.org");
  });
});

describe("apiErrorMessage", () => {
  it("prefers the API's own message", () => {
    expect(apiErrorMessage({ message: " You can't delete yourself. " }, 400)).toBe(
      "You can't delete yourself.",
    );
  });

  it("falls back to a message for the status", () => {
    expect(apiErrorMessage(null, 401)).toBe("Sign in again to continue.");
    expect(apiErrorMessage({ message: "" }, 403)).toBe("You don't have permission to do that.");
    expect(apiErrorMessage({}, 404)).toBe("That account could not be found.");
    expect(apiErrorMessage("oops", 502)).toBe("The Kharis API returned an error (502). Try again.");
  });
});

describe("studio API requests", () => {
  it("sends the Supabase access token and returns data", async () => {
    fetchMock.mockResolvedValue(
      reply(200, {
        status: true,
        message: "ok",
        data: { id: "u1", email: "a@example.com", role: "branch_admin", branchIds: ["b1", 7] },
      }),
    );

    await expect(getStudioMe()).resolves.toEqual({
      id: "u1",
      email: "a@example.com",
      role: "branch_admin",
      branchIds: ["b1"],
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.org/v1/studio/me",
      expect.objectContaining({
        method: "GET",
        headers: { Authorization: "Bearer token-123" },
      }),
    );
  });

  it("treats an unknown role as no access", async () => {
    fetchMock.mockResolvedValue(reply(200, { data: { id: "u1", role: "owner" } }));
    await expect(getStudioMe()).resolves.toMatchObject({ role: "none", branchIds: [] });
  });

  it("throws the API message on a non-2xx response", async () => {
    fetchMock.mockResolvedValue(reply(400, { message: "You can't delete yourself." }));
    await expect(deleteStudioUser("me")).rejects.toThrow("You can't delete yourself.");
  });

  it("throws when a 200 response says status false", async () => {
    fetchMock.mockResolvedValue(
      reply(200, { status: false, message: "The last super admin can't be removed." }),
    );
    await expect(deleteStudioUser("u2")).rejects.toThrow("The last super admin can't be removed.");
  });

  it("uses the status fallback when the body is not JSON", async () => {
    fetchMock.mockResolvedValue(new Response("Bad gateway", { status: 502 }));
    await expect(listStudioUsers()).rejects.toThrow(
      "The Kharis API returned an error (502). Try again.",
    );
  });

  it("explains a network failure", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(getStudioMe()).rejects.toThrow("The Kharis API could not be reached.");
  });

  it("refuses to call without an API address", async () => {
    vi.stubEnv("NEXT_PUBLIC_KHARIS_API_URL", "");
    await expect(getStudioMe()).rejects.toThrow("NEXT_PUBLIC_KHARIS_API_URL");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refuses to call without a session", async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    await expect(getStudioMe()).rejects.toThrow("Sign in again to continue.");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a /me response without an account", async () => {
    fetchMock.mockResolvedValue(reply(200, { status: true, data: null }));
    await expect(getStudioMe()).rejects.toThrow("The Kharis API did not return your account.");
  });

  it("encodes user ids in the path", async () => {
    fetchMock.mockResolvedValue(reply(200, { status: true, data: null }));
    await deleteStudioUser("a/b");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.org/v1/studio/users/a%2Fb",
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
