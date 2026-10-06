"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChatMarkdown } from "@/components/ChatMarkdown";
import { Icon } from "@/components/Icon";
import {
  contactHandoffUrl,
  replyOffersContact,
  saveGraceHandoff,
} from "@/lib/grace-handoff";
import {
  hasAppMarker,
  hasContactMarker,
  stripGraceMarkers,
} from "@/lib/grace-markers";
import { KHARIS_APP } from "@/lib/kharis-app";

type Role = "user" | "assistant";

type MessageCard = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
};

type Msg = {
  role: Role;
  content: string;
  cards?: MessageCard[];
};

const TOPICS = [
  {
    id: "branch",
    label: "Find a branch near me",
    prompt: "Please help me find a Kharis branch near me.",
  },
  {
    id: "life",
    label: "Baptism, fasting or serving",
    prompt:
      "I'd like to know about Kharis Life ministries: baptism, fasting, or serving in a department. Where do I start?",
  },
  {
    id: "faith",
    label: "Faith, prayer, or scripture",
    prompt: "I'd like help with faith, prayer, or scripture.",
  },
  {
    id: "messages",
    label: "Pastor David messages",
    prompt: "Please recommend a Pastor David Antwi message for me.",
  },
  {
    id: "other",
    label: "Other - I'll type it myself",
    prompt: "",
  },
] as const;

const HELP_DELAY_MS = 4500;

const WELCOME =
  "Hi, I'm Grace, your assistant. What can I help you with today?\n\nPick an option below, or choose Other to ask your own question.";

function normalizeCards(cards: MessageCard[] | undefined): MessageCard[] | undefined {
  if (!Array.isArray(cards)) return undefined;
  const cleaned = cards.filter(
    (c) =>
      c &&
      typeof c.id === "string" &&
      typeof c.title === "string" &&
      typeof c.url === "string" &&
      typeof c.thumbnail === "string",
  );
  return cleaned.length ? cleaned : undefined;
}

const HANDOFF_LINE =
  "I can pass this to our team along with our chat so you don't have to repeat yourself.";
const APP_LINE =
  "The Kharis app has the full library of Pastor David's messages:";

/** Hide control markers; keep bubble tidy when poster cards carry the links. */
function tidyAssistantText(content: string, hasCards: boolean): string {
  let text = stripGraceMarkers(content);
  if (!text && hasContactMarker(content)) return HANDOFF_LINE;
  if (hasAppMarker(content)) {
    const storeLink =
      /\[([^\]\n]+)\]\((?:https?:\/\/)?(?:apps\.apple\.com|play\.google\.com)[^)]*\)/gi;
    const storeUrl =
      /(?:https?:\/\/)?(?:apps\.apple\.com|play\.google\.com)\/[^\s)]+/gi;
    text = text
      .replace(storeLink, "$1")
      .replace(storeUrl, "")
      .replace(/\(\s*\)/g, "")
      .replace(/^[ \t]*(?:[-•*]|\d+[.)])[ \t]*[^\n]{0,32}$/gm, (line) =>
        /iphone|ios|android|app store|google play|apple/i.test(line) ||
        !/[A-Za-z]{3}/.test(line)
          ? ""
          : line,
      )
      .replace(/([^\s.!?])[ \t]*:[ \t]*$/gm, "$1.")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    if (!text) return APP_LINE;
  }
  if (hasCards) {
    const ytLink =
      /\[([^\]\n]+)\]\((?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)[^)]*\)/gi;
    const ytUrl =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?[^\s)]*|shorts\/[^\s)]+|embed\/[^\s)]+)|youtu\.be\/[^\s)]+)/gi;
    text = text
      .replace(ytLink, "$1")
      .replace(ytUrl, "")
      .replace(/\(\s*\)/g, "")
      .replace(/([^\s.!?])[ \t]*:[ \t]*$/gm, "$1.")
      .replace(/[ \t]*[—–\-|:]\s*$/gm, "")
      .replace(/^[ \t]*[-•*]\s*$/gm, "")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    if (!text) {
      return "Here are a few messages you might enjoy. Tap a poster to watch:";
    }
  }
  return text;
}

function GraceAvatar({ className = "" }: { className?: string }) {
  return (
    <span className={`life-chat__avatar ${className}`.trim()} aria-hidden>
      G
    </span>
  );
}

function TypingDots() {
  return (
    <span className="life-chat__dots" aria-hidden>
      <span />
      <span />
      <span />
    </span>
  );
}

function ChatIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path
        d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6A2.5 2.5 0 0 1 16.5 15H11l-3.8 3.2c-.5.4-1.2.1-1.2-.5V15H7.5A2.5 2.5 0 0 1 5 12.5v-6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MessageCards({ cards }: { cards: MessageCard[] }) {
  if (!cards.length) return null;
  return (
    <ul className="life-chat__cards" aria-label="Recommended messages">
      {cards.map((card) => (
        <li key={card.id} className="life-chat__card-item">
          <a
            className="life-chat__card"
            href={card.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch ${card.title} on YouTube`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="life-chat__card-thumb"
              src={card.thumbnail}
              alt=""
              loading="lazy"
              width={320}
              height={180}
              draggable={false}
            />
            <span className="life-chat__card-body">
              <span className="life-chat__card-title">{card.title}</span>
              <span className="life-chat__card-cta">Watch on YouTube →</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function AppDownloadButtons() {
  return (
    <div className="life-chat__apps" aria-label={`Get the ${KHARIS_APP.name}`}>
      <a
        className="life-chat__app"
        href={KHARIS_APP.iosUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="apple" className="life-chat__app-icon" />
        <span className="life-chat__app-copy">
          <span className="life-chat__app-kicker">Download on the</span>
          <span className="life-chat__app-store">App Store</span>
        </span>
      </a>
      <a
        className="life-chat__app"
        href={KHARIS_APP.androidUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="android" className="life-chat__app-icon" />
        <span className="life-chat__app-copy">
          <span className="life-chat__app-kicker">Get it on</span>
          <span className="life-chat__app-store">Google Play</span>
        </span>
      </a>
    </div>
  );
}

export function LifeChatbot() {
  const [open, setOpen] = useState(false);
  const [launcherReady, setLauncherReady] = useState(false);
  const [nudgeOpen, setNudgeOpen] = useState(false);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  /** True once the first streamed token has been appended (hides typing dots). */
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const [unread, setUnread] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: WELCOME,
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openRef = useRef(open);
  const messagesRef = useRef(messages);
  openRef.current = open;
  messagesRef.current = messages;

  useEffect(() => {
    const t = window.setTimeout(() => {
      setLauncherReady(true);
      setNudgeOpen(true);
    }, HELP_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    setUnread(false);
    setNudgeOpen(false);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, busy, streaming, composerOpen]);

  useEffect(() => {
    if (open && composerOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 180);
    }
  }, [open, composerOpen]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const openChat = () => {
    setOpen(true);
    setUnread(false);
    setNudgeOpen(false);
    setNudgeDismissed(true);
  };

  const goToContact = () => {
    const payload = saveGraceHandoff(
      messagesRef.current.map((m) => ({
        role: m.role,
        content:
          m.role === "assistant"
            ? tidyAssistantText(m.content, Boolean(m.cards?.length))
            : m.content,
      })),
    );
    window.location.href = contactHandoffUrl(payload.ticketId);
  };

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    setError("");
    setComposerOpen(true);
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    // Typing dots until the first streamed token arrives.
    setStreaming(false);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const ctype = res.headers.get("content-type") || "";

      // Non-SSE early errors (config / validation) still return JSON.
      if (!ctype.includes("text/event-stream")) {
        const data = (await res.json()) as {
          ok?: boolean;
          reply?: string;
          error?: string;
          cards?: MessageCard[];
        };
        if (!res.ok || !data.ok || !data.reply) {
          setError(
            data.error ||
              "I'm a bit busy right now, please try again in a moment.",
          );
          return;
        }
        const cards = normalizeCards(data.cards);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply!,
            ...(cards?.length ? { cards } : {}),
          },
        ]);
        if (!openRef.current) setUnread(true);
        return;
      }

      if (!res.ok || !res.body) {
        setError("I'm a bit busy right now, please try again in a moment.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistant = "";
      let started = false;
      let sawDone = false;
      let streamError = "";

      const appendChunk = (piece: string) => {
        if (!piece) return;
        assistant += piece;
        if (!started) {
          started = true;
          setStreaming(true);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: assistant },
          ]);
        } else {
          const snapshot = assistant;
          setMessages((prev) => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            if (last?.role === "assistant") {
              copy[copy.length - 1] = { ...last, content: snapshot };
            }
            return copy;
          });
        }
      };

      const applyCards = (cards: MessageCard[] | undefined) => {
        if (!cards?.length) return;
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last?.role === "assistant") {
            copy[copy.length - 1] = { ...last, cards };
          }
          return copy;
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;

          let evt: {
            type?: string;
            text?: string;
            reply?: string;
            error?: string;
            cards?: MessageCard[];
          };
          try {
            evt = JSON.parse(payload) as typeof evt;
          } catch {
            continue;
          }

          if (evt.type === "chunk" && typeof evt.text === "string") {
            appendChunk(evt.text);
          } else if (evt.type === "done") {
            sawDone = true;
            if (typeof evt.reply === "string" && evt.reply && !assistant) {
              appendChunk(evt.reply);
            } else if (
              typeof evt.reply === "string" &&
              evt.reply &&
              evt.reply !== assistant
            ) {
              // Prefer server-assembled final text (trimmed) if it differs.
              assistant = evt.reply;
              setMessages((prev) => {
                const copy = [...prev];
                const last = copy[copy.length - 1];
                if (last?.role === "assistant") {
                  copy[copy.length - 1] = {
                    ...last,
                    content: evt.reply!,
                  };
                } else {
                  copy.push({ role: "assistant", content: evt.reply! });
                }
                return copy;
              });
            }
            applyCards(normalizeCards(evt.cards));
          } else if (evt.type === "error") {
            streamError =
              evt.error ||
              "I'm a bit busy right now, please try again in a moment.";
          }
        }
      }

      if (streamError && !assistant) {
        setError(streamError);
        return;
      }
      if (!sawDone && !assistant) {
        setError("I'm a bit busy right now, please try again in a moment.");
        return;
      }
      if (!openRef.current) setUnread(true);
    } catch {
      setError("Could not reach the chat just now. Please try again.");
    } finally {
      setBusy(false);
      setStreaming(false);
    }
  };

  const onPick = (id: string, label: string, prompt: string) => {
    if (busy) return;
    setPicked(id);
    if (id === "other") {
      setComposerOpen(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sure, type your question below and I'll help.",
        },
      ]);
      return;
    }
    void send(prompt || label);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  const showTopics =
    !busy && messages.filter((m) => m.role === "user").length === 0;
  const showFab = launcherReady && (nudgeDismissed || open);
  const lastAssistant = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");
  const showContactCta =
    !busy &&
    !showTopics &&
    Boolean(
      lastAssistant &&
        (hasContactMarker(lastAssistant.content) ||
          replyOffersContact(stripGraceMarkers(lastAssistant.content))),
    );

  return (
    <>
      {launcherReady && nudgeOpen && !open ? (
        <div
          className="life-chat__nudge"
          role="dialog"
          aria-label="Need help from Grace?"
        >
          <span className="life-chat__nudge-icon" aria-hidden>
            <ChatIcon size={18} />
          </span>
          <div className="life-chat__nudge-copy">
            <p className="life-chat__nudge-title">Need any help?</p>
            <p className="life-chat__nudge-text">
              I&apos;m Grace. Ask me about faith, Life, branches or messages.
            </p>
            <div className="life-chat__nudge-actions">
              <button
                type="button"
                className="life-chat__nudge-yes"
                onClick={openChat}
              >
                Yes, please
              </button>
              <button
                type="button"
                className="life-chat__nudge-no"
                onClick={() => {
                  setNudgeOpen(false);
                  setNudgeDismissed(true);
                }}
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showFab ? (
        <button
          type="button"
          className={`life-chat__fab${open ? " is-open" : ""}`}
          aria-expanded={open}
          aria-controls="life-chat-panel"
          aria-label={open ? "Close chat" : "Open chat with Grace"}
          onClick={() => {
            if (open) setOpen(false);
            else openChat();
          }}
        >
          {open ? (
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <ChatIcon />
          )}
          {unread && !open ? (
            <span className="life-chat__badge" aria-label="New reply" />
          ) : null}
        </button>
      ) : null}

      <div
        className={`life-chat__scrim${open ? " is-open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      <aside
        id="life-chat-panel"
        className={`life-chat${open ? " is-open" : ""}`}
        aria-label="Chat with Grace"
        aria-hidden={!open}
      >
        <header className="life-chat__head">
          <div className="life-chat__brand">
            <GraceAvatar />
            <div>
              <p className="life-chat__name">
                Grace
                <span className="life-chat__online" title="Online" />
              </p>
              <p className="life-chat__status">your assistant · online</p>
            </div>
          </div>
          <button
            type="button"
            className="life-chat__x"
            aria-label="Close chat"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </header>

        <div className="life-chat__thread" role="log" aria-live="polite">
          {messages.map((m, i) => (
            <div
              key={`${m.role}-${i}`}
              className={`life-chat__row life-chat__row--${m.role}`}
            >
              {m.role === "assistant" ? (
                <div className="life-chat__meta">
                  <GraceAvatar className="is-mini" />
                  <div className="life-chat__stack">
                    <span className="life-chat__who">Grace</span>
                    <div className="life-chat__bubble life-chat__bubble--assistant">
                      <ChatMarkdown
                        text={tidyAssistantText(
                          m.content,
                          Boolean(m.cards?.length),
                        )}
                        onContactClick={goToContact}
                        onNavigate={() => setOpen(false)}
                      />
                    </div>
                    {m.cards?.length ? <MessageCards cards={m.cards} /> : null}
                    {hasAppMarker(m.content) ? <AppDownloadButtons /> : null}
                  </div>
                </div>
              ) : (
                <div className="life-chat__bubble life-chat__bubble--user">
                  <p className="life-chat__p life-chat__p--plain">
                    {m.content}
                  </p>
                </div>
              )}
            </div>
          ))}

          {showTopics ? (
            <div className="life-chat__options" aria-label="Choose a topic">
              {TOPICS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`life-chat__option${picked === t.id ? " is-selected" : ""}`}
                  disabled={busy}
                  onClick={() => onPick(t.id, t.label, t.prompt)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          ) : null}

          {busy && !streaming ? (
            <div className="life-chat__row life-chat__row--assistant">
              <div className="life-chat__meta">
                <GraceAvatar className="is-mini" />
                <div className="life-chat__stack">
                  <span className="life-chat__who">Grace</span>
                  <div className="life-chat__bubble life-chat__bubble--assistant life-chat__typing">
                    <TypingDots />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {showContactCta ? (
            <button
              type="button"
              className="life-chat__handoff"
              onClick={goToContact}
            >
              Open contact form with chat ticket
            </button>
          ) : null}

          {!showTopics && !busy ? (
            <button
              type="button"
              className="life-chat__again"
              onClick={() => {
                setPicked(null);
                setComposerOpen(false);
                setMessages([
                  {
                    role: "assistant",
                    content:
                      "Sure, what would you like next? Pick an option, or choose Other to type.",
                  },
                ]);
              }}
            >
              Ask something else
            </button>
          ) : null}

          <div ref={bottomRef} />
        </div>

        {error ? <p className="life-chat__err">{error}</p> : null}

        {(composerOpen || !showTopics) && (
          <form className="life-chat__form" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="life-chat-input">
              Your question
            </label>
            <input
              id="life-chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type your message…"
              autoComplete="off"
              disabled={busy}
            />
            <button
              type="submit"
              className="life-chat__send"
              disabled={busy || !input.trim()}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                <path
                  d="M4 12h12M12 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        )}
      </aside>
    </>
  );
}
