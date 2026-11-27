import { afterEach, expect, it, vi } from "vitest";
import { POST } from "./route";

const mainFetch = vi.hoisted(() => vi.fn<(request: Request) => Promise<Response>>());
vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: () => ({ env: { KHARIS_MAIN: { fetch: mainFetch } } }),
}));

afterEach(() => {
  mainFetch.mockReset();
  vi.unstubAllEnvs();
});

function send(messages: unknown) {
  return POST(
    new Request("https://kp2.example/kp2/api/chat", {
      method: "POST",
      headers: { Cookie: "session=private" },
      body: JSON.stringify({ site: "main", page: "/kp2/branches", messages }),
    }),
  );
}

it("sends KP2 history to the main Worker without a local Gemini key", async () => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("KHARIS_MAIN_CHAT_ORIGIN", "");
  vi.stubEnv("GEMINI_API_KEY", "");
  const messages = [
    { role: "user", content: "Where is Romford?" },
    { role: "assistant", content: "In London." },
    { role: "user", content: "When is its service?" },
  ];
  mainFetch.mockImplementation(async (request) => {
    expect(request.headers.has("Cookie")).toBe(false);
    expect(await request.json()).toEqual({ site: "kp2", page: "/kp2/branches", messages });
    return Response.json({ ok: true, reply: "See the Romford branch page." });
  });
  const response = await send(messages);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ ok: true, reply: "See the Romford branch page." });
});

it("rejects empty conversations before contacting main", async () => {
  expect((await send([])).status).toBe(400);
  expect(mainFetch).not.toHaveBeenCalled();
});
