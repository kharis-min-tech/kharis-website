"use client";

import { FormEvent, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

function ChatMark() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor">
      <path d="M4 4.5h16a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1H9.2L4 20.8V5.5a1 1 0 0 1 1-1z" />
    </svg>
  );
}

type Turn = { role: "user" | "assistant"; content: string };

const WELCOME =
  "Hi, I'm Grace. Tell me what you want to change and I'll point you to the right place in the studio.";

const CHIPS = [
  { label: "Edit a branch", prompt: "Where do I edit a branch, including its photos?" },
  { label: "Visitors", prompt: "Where do I see people who asked to visit?" },
  { label: "KP2 events", prompt: "Where do I add an event for the KP2 website?" },
  { label: "Messages", prompt: "Where do contact form messages show up?" },
];

function safeHref(raw: string) {
  const href = raw.trim();
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  return null;
}

function Reply({ text }: { text: string }) {
  const chunks = text.split(/(\[[^\]]+\]\([^)\s]+\))/g);
  return (
    <>
      {chunks.map((chunk, index) => {
        const match = chunk.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (!match) return <span key={index}>{chunk}</span>;
        const href = safeHref(match[2]);
        if (!href) return <span key={index}>{match[1]}</span>;
        return (
          <a key={index} href={href}>
            {match[1]}
          </a>
        );
      })}
    </>
  );
}

export function GraceChat() {
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Turn[]>([{ role: "assistant", content: WELCOME }]);

  const page = `${pathname || "/"}${params.toString() ? `?${params.toString()}` : ""}`;

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    setError("");
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const { data } = await getSupabase().auth.getSession();
      const token = data.session?.access_token;
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          page,
          messages: next.map((turn) => ({ role: turn.role, content: turn.content })),
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; reply?: string; error?: string };
      if (!response.ok || !payload.ok || !payload.reply) {
        setError(payload.error || "I'm a bit busy right now, please try again in a moment.");
        return;
      }
      setMessages((current) => [...current, { role: "assistant", content: payload.reply! }]);
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
    <div className="studio-grace">
      {open ? (
        <section className="studio-grace__panel" aria-label="Ask Grace">
          <header className="studio-grace__head">
            <span className="studio-grace__mark">
              <ChatMark />
            </span>
            <div>
              <strong>Grace</strong>
              <p>Studio guide</p>
            </div>
            <button type="button" className="studio-grace__close" onClick={() => setOpen(false)}>
              Close
            </button>
          </header>
          <div className="studio-grace__log">
            {messages.map((turn, index) => (
              <div key={index}>
                <div className={`studio-grace__bubble studio-grace__bubble--${turn.role}`}>
                  <Reply text={turn.content} />
                </div>
                {index === 0 && messages.length === 1 ? (
                  <div className="studio-grace__chips">
                    {CHIPS.map((chip) => (
                      <button key={chip.label} type="button" onClick={() => void send(chip.prompt)}>
                        {chip.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          {error ? <p className="studio-grace__error">{error}</p> : null}
          {busy ? <p className="studio-grace__error">Grace is typing…</p> : null}
          <form className="studio-grace__form" onSubmit={onSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Where do I…"
              aria-label="Ask Grace"
            />
            <button type="submit" disabled={busy}>
              Send
            </button>
          </form>
        </section>
      ) : (
        <button
          type="button"
          className="studio-grace__fab"
          aria-label="Ask Grace"
          onClick={() => setOpen(true)}
        >
          <ChatMark />
        </button>
      )}
    </div>
  );
}
