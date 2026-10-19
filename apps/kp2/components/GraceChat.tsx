"use client";

import { FormEvent, useState } from "react";
import { usePathname } from "next/navigation";
import { withBasePath } from "@/lib/base-path";

function ChatMark() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor">
      <path d="M4 4.5h16a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1H9.2L4 20.8V5.5a1 1 0 0 1 1-1z" />
    </svg>
  );
}

type Turn = { role: "user" | "assistant"; content: string };

const WELCOME =
  "Hi, I'm Grace, your assistant. I can help you find a KP2 branch, a service, or the right page.";

const CHIPS = [
  { label: "Find a branch", prompt: "Help me find a Kharis Phase 2 branch near me." },
  { label: "What's on", prompt: "What events are coming up, and where do I see them?" },
  { label: "Give", prompt: "How do I give?" },
  { label: "Contact", prompt: "How do I contact the team?" },
];

/** Drop characters that would be read as HTML if this string were inserted as markup. */
function neutralizeHtml(value: string) {
  return value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function safeHref(raw: string) {
  let url: URL;
  try {
    url = new URL(raw.trim(), "https://kharis.org");
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (url.username || url.password) return null;
  const local = url.hostname === "kharis.org" || url.hostname === "www.kharis.org";
  const href = local
    ? withBasePath(`${url.pathname}${url.search}${url.hash}`)
    : url.protocol === "https:"
      ? url.href
      : "";
  return href ? neutralizeHtml(href) : null;
}

function Reply({ text }: { text: string }) {
  const chunks = text.split(/(\[[^\]]+\]\([^)\s]+\))/g);
  return (
    <>
      {chunks.map((chunk, index) => {
        const match = chunk.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (!match) return <span key={index}>{neutralizeHtml(chunk)}</span>;
        const href = safeHref(match[2]);
        const label = neutralizeHtml(match[1]);
        if (!href) return <span key={index}>{label}</span>;
        return (
          <a key={index} href={href}>
            {label}
          </a>
        );
      })}
    </>
  );
}

export function GraceChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Turn[]>([{ role: "assistant", content: WELCOME }]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    setError("");
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const response = await fetch(withBasePath("/api/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pathname || "/",
          messages: next.map((turn) => ({ role: turn.role, content: turn.content })),
        }),
      });
      const data = (await response.json()) as { ok?: boolean; reply?: string; error?: string };
      if (!response.ok || !data.ok || !data.reply) {
        setError(data.error || "I'm a bit busy right now, please try again in a moment.");
        return;
      }
      setMessages((current) => [...current, { role: "assistant", content: data.reply! }]);
    } catch {
      setError("I'm a bit busy right now, please try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(input);
  }

  return (
    <div className="kp-grace">
      {open ? (
        <section className="kp-grace__panel" aria-label="Chat with Grace">
          <header className="kp-grace__head">
            <span className="kp-grace__mark">
              <ChatMark />
            </span>
            <div>
              <strong>Grace</strong>
              <p>Your KP2 assistant</p>
            </div>
            <button type="button" className="kp-grace__close" onClick={() => setOpen(false)}>
              Close
            </button>
          </header>
          <div className="kp-grace__log">
            {messages.map((turn, index) => (
              <div key={index}>
                <div className={`kp-grace__bubble kp-grace__bubble--${turn.role}`}>
                  <Reply text={turn.content} />
                </div>
                {index === 0 && messages.length === 1 ? (
                  <div className="kp-grace__chips">
                    {CHIPS.map((chip) => (
                      <button key={chip.label} type="button" onClick={() => void send(chip.prompt)}>
                        {chip.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {busy ? <p className="kp-grace__error">Grace is typing…</p> : null}
          </div>
          {error ? <p className="kp-grace__error">{error}</p> : null}
          <form className="kp-grace__form" onSubmit={onSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask Grace"
              aria-label="Message Grace"
            />
            <button type="submit" disabled={busy}>
              Send
            </button>
          </form>
        </section>
      ) : (
        <button
          type="button"
          className="kp-grace__fab"
          aria-label="Open chat with Grace"
          onClick={() => setOpen(true)}
        >
          <ChatMark />
        </button>
      )}
    </div>
  );
}
