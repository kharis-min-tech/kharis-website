import { getSupabase } from "./supabase";

export const STUDIO_ROLES = ["none", "branch_admin", "super_admin"] as const;

export type StudioRole = (typeof STUDIO_ROLES)[number];

export type StudioMe = {
  id: string;
  email: string;
  role: StudioRole;
  branchIds: string[];
};

export type StudioUser = StudioMe & {
  createdAt: string | null;
  lastSignInAt: string | null;
};

export function isStudioRole(value: unknown): value is StudioRole {
  return STUDIO_ROLES.includes(value as StudioRole);
}

export function studioRoleLabel(role: StudioRole) {
  if (role === "super_admin") return "Super admin";
  if (role === "branch_admin") return "Branch admin";
  return "No access";
}

/** The Kharis backend origin, without /v1 or a trailing slash. */
export function kharisApiUrl() {
  return (process.env.NEXT_PUBLIC_KHARIS_API_URL ?? "").trim().replace(/\/+$/, "");
}

/** The message to show when the API refuses a request. */
export function apiErrorMessage(payload: unknown, status: number) {
  const message =
    payload && typeof payload === "object" && "message" in payload ? payload.message : null;
  if (typeof message === "string" && message.trim()) return message.trim();
  if (status === 401) return "Sign in again to continue.";
  if (status === 403) return "You don't have permission to do that.";
  if (status === 404) return "That account could not be found.";
  return `The Kharis API returned an error (${status}). Try again.`;
}

async function accessToken() {
  const { data } = await getSupabase().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Sign in again to continue.");
  return token;
}

/** Calls the Kharis API. Server routes pass the caller's token; the browser uses its session. */
export async function studioRequest(
  path: string,
  init: { method?: string; body?: unknown; token?: string } = {},
) {
  const base = kharisApiUrl();
  if (!base) {
    throw new Error("The Kharis API address is not set. Add NEXT_PUBLIC_KHARIS_API_URL.");
  }
  const token = init.token || (await accessToken());
  let response: Response;
  try {
    response = await fetch(`${base}${path}`, {
      method: init.method ?? "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(init.body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    });
  } catch {
    throw new Error("The Kharis API could not be reached. Check your connection and try again.");
  }
  const payload = (await response.json().catch(() => null)) as {
    status?: unknown;
    message?: unknown;
    data?: unknown;
  } | null;
  if (!response.ok || payload?.status === false) {
    throw new Error(apiErrorMessage(payload, response.status));
  }
  return payload?.data ?? null;
}

function asText(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asMe(value: unknown): StudioMe {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    id: asText(row.id),
    email: asText(row.email),
    role: isStudioRole(row.role) ? row.role : "none",
    branchIds: Array.isArray(row.branchIds)
      ? row.branchIds.filter((id): id is string => typeof id === "string")
      : [],
  };
}

function asUser(value: unknown): StudioUser {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    ...asMe(row),
    createdAt: asText(row.createdAt) || null,
    lastSignInAt: asText(row.lastSignInAt) || null,
  };
}

export async function getStudioMe(token?: string) {
  const data = await studioRequest("/v1/studio/me", { token });
  if (!data || typeof data !== "object") {
    throw new Error("The Kharis API did not return your account.");
  }
  return asMe(data);
}

export async function listStudioUsers() {
  const data = await studioRequest("/v1/studio/users");
  return Array.isArray(data) ? data.map(asUser) : [];
}

export async function inviteStudioUser(input: {
  email: string;
  role: StudioRole;
  branchIds: string[];
}) {
  await studioRequest("/v1/studio/users", { method: "POST", body: input });
}

export async function updateStudioUser(
  id: string,
  patch: { role?: StudioRole; branchIds?: string[] },
) {
  await studioRequest(`/v1/studio/users/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: patch,
  });
}

export async function deleteStudioUser(id: string) {
  await studioRequest(`/v1/studio/users/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function sendStudioPasswordReset(id: string) {
  await studioRequest(`/v1/studio/users/${encodeURIComponent(id)}/password-reset`, {
    method: "POST",
  });
}
