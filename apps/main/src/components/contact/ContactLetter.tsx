"use client";

import Image from "@/components/SiteImage";
import { useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { branchDisplayName, isKp2Branch, type ContactLocation } from "@/lib/contact-branches";
import {
  buildContactPrefill,
  clearGraceHandoff,
  isGraceTicketId,
  readGraceHandoff,
} from "@/lib/grace-handoff";

/** Values match the topics /api/contact accepts. */
const TOPICS = [
  { value: "Sunday visit", label: "planning a visit" },
  { value: "Prayer", label: "prayer" },
  { value: "Pastoral", label: "pastoral care" },
  { value: "Baptism", label: "baptism" },
  { value: "Giving", label: "giving" },
  { value: "General", label: "something else" },
] as const;
const CHAT_TOPIC = { value: "Chat follow-up", label: "my chat with Grace" } as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  topic: "Sunday visit",
  message: "",
  chatTicket: "",
  chatTranscript: "",
};

function splitName(full: string) {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0]!, last: parts[0]! };
  return { first: parts[0]!, last: parts.slice(1).join(" ") };
}

function check(form: typeof EMPTY): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = "Add your name so we know who to write back to.";
  if (!EMAIL.test(form.email.trim())) errors.email = "That email address doesn't look right.";
  if (form.message.trim().length < 8) errors.message = "Add a line or two so we know how to help.";
  return errors;
}

type Props = {
  branches: ContactLocation[];
  branch: string;
  onBranchChange: (name: string) => void;
  /** Increments when "Write to this branch" is pressed, to move focus into the letter. */
  focusSignal: number;
};

export function ContactLetter({ branches, branch, onBranchChange, focusSignal }: Props) {
  const searchParams = useSearchParams();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<{ first: string; email: string; ticket: string } | null>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const thanksRef = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<Partial<Record<Field, HTMLElement | null>>>({});

  // A visitor handed over from the Grace chat arrives with a ticket and a summary of the chat.
  useEffect(() => {
    const raw = searchParams.get("chatTicket")?.trim().toUpperCase();
    const ticket = isGraceTicketId(raw) ? raw : null;
    const handoff = readGraceHandoff(ticket);
    const payload =
      handoff ??
      (ticket
        ? {
            ticketId: ticket,
            createdAt: new Date().toISOString(),
            messages: [],
            summary: "Chat transcript unavailable in this browser session.",
          }
        : null);
    if (!payload) return;

    setForm((f) => ({
      ...f,
      topic: CHAT_TOPIC.value,
      chatTicket: payload.ticketId,
      chatTranscript: payload.summary,
      message: f.message.trim() ? f.message : buildContactPrefill(payload),
    }));
  }, [searchParams]);

  useEffect(() => {
    if (focusSignal > 0) messageRef.current?.focus({ preventScroll: true });
  }, [focusSignal]);

  useEffect(() => {
    if (sent) thanksRef.current?.focus();
  }, [sent]);

  const set = (key: keyof typeof EMPTY) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setServerError("");

    const found = check(form);
    setErrors(found);
    const firstBad = (["name", "email", "message"] as Field[]).find((f) => found[f]);
    if (firstBad) {
      fieldRefs.current[firstBad]?.focus();
      return;
    }

    setBusy(true);
    const { first, last } = splitName(form.name);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          first,
          last,
          email: form.email.trim(),
          phone: form.phone.trim(),
          topic: form.topic,
          branch,
          branchId: branches.find((b) => b.name === branch)?.id,
          message: form.message,
          chatTicket: form.chatTicket || undefined,
          chatTranscript: form.chatTranscript || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setServerError(data.error || "We couldn't send that just now. Please try again.");
        return;
      }
      clearGraceHandoff();
      setSent({ first, email: form.email.trim(), ticket: form.chatTicket });
      setForm(EMPTY);
    } catch {
      setServerError("We couldn't reach Kharis just now. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const topics = form.chatTicket ? [CHAT_TOPIC, ...TOPICS] : TOPICS;
  const signature = form.name.trim().split(/\s+/)[0];

  return (
    <section id="write" className="hello-write" aria-labelledby="hello-write-title">
      <div className="hello-write__inner">
        <div className="hello-write__main">
          <header className="hello-write__head">
            <p className="hello-eyebrow">Write to us</p>
            <h2 id="hello-write-title" className="hello-h2">
              Start with a <em>few lines.</em>
            </h2>
            <p className="hello-write__sub">
              Tell us what&apos;s on your heart. Your message goes to the Kharis team, marked for
              the branch you choose.
            </p>
          </header>

          <div className="hello-paper">
            {sent ? (
              <div ref={thanksRef} tabIndex={-1} className="hello-thanks" role="status">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.kharis.org/site-images/main/113a6a24b1d3741b/kharis-logo.png"
                  alt=""
                  aria-hidden
                  className="hello-thanks__dove"
                />
                <p className="hello-thanks__title">
                  Thank you{sent.first ? `, ${sent.first}` : ""}.
                </p>
                <p>
                  Your message is with the Kharis team. We&apos;ll reply to{" "}
                  <strong>{sent.email}</strong>.
                </p>
                {sent.ticket ? (
                  <p className="hello-thanks__ticket">
                    Grace chat ticket <strong>{sent.ticket}</strong>
                  </p>
                ) : null}
                <button type="button" className="hello-link" onClick={() => setSent(null)}>
                  Write another message
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="hello-letter">
                {form.chatTicket ? (
                  <p className="hello-letter__ticket">
                    Following up your chat with Grace · ticket <strong>{form.chatTicket}</strong>
                  </p>
                ) : null}

                <p className="hello-letter__greeting">Hi Kharis,</p>

                <p className="hello-letter__line">
                  My name is{" "}
                  <span className="hello-tie">
                    <input
                      ref={(el) => {
                        fieldRefs.current.name = el;
                      }}
                      className="hello-field hello-field--name"
                      aria-label="Your name"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "hello-err-name" : undefined}
                      autoComplete="name"
                      placeholder="your name"
                      value={form.name}
                      onChange={(e) => set("name")(e.target.value)}
                    />
                    ,
                  </span>{" "}
                  and you can reach me at{" "}
                  <input
                    ref={(el) => {
                      fieldRefs.current.email = el;
                    }}
                    className="hello-field hello-field--email"
                    type="email"
                    inputMode="email"
                    aria-label="Your email address"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "hello-err-email" : undefined}
                    autoComplete="email"
                    placeholder="email address"
                    value={form.email}
                    onChange={(e) => set("email")(e.target.value)}
                  />{" "}
                  <span className="hello-letter__optional">
                    or on{" "}
                    <input
                      className="hello-field hello-field--phone"
                      type="tel"
                      aria-label="Your phone number (optional)"
                      autoComplete="tel"
                      placeholder="phone, optional"
                      value={form.phone}
                      onChange={(e) => set("phone")(e.target.value)}
                    />
                    <span className="hello-letter__stop">.</span>
                  </span>
                </p>

                <p className="hello-letter__line">
                  I&apos;m getting in touch about{" "}
                  <span className="hello-tie">
                    <select
                      className="hello-field hello-field--select"
                      aria-label="What your message is about"
                      value={form.topic}
                      onChange={(e) => set("topic")(e.target.value)}
                    >
                      {topics.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    ,
                  </span>{" "}
                  and the branch I have in mind is{" "}
                  <span className="hello-tie">
                    <select
                      className="hello-field hello-field--select"
                      aria-label="Branch"
                      value={branch}
                      onChange={(e) => onBranchChange(e.target.value)}
                    >
                      <option value="">not decided yet</option>
                      <optgroup label="Kharis">
                        {branches
                          .filter((b) => !isKp2Branch(b))
                          .map((b) => (
                            <option key={b.id} value={b.name}>
                              {branchDisplayName(b.name)}
                            </option>
                          ))}
                      </optgroup>
                      {branches.some(isKp2Branch) ? (
                        <optgroup label="KP2">
                          {branches.filter(isKp2Branch).map((b) => (
                            <option key={b.id} value={b.name}>
                              {branchDisplayName(b.name)}
                            </option>
                          ))}
                        </optgroup>
                      ) : null}
                    </select>
                    .
                  </span>
                </p>

                <label className="hello-letter__message">
                  <span className="sr-only">Your message</span>
                  <textarea
                    ref={(el) => {
                      messageRef.current = el;
                      fieldRefs.current.message = el;
                    }}
                    rows={form.chatTicket ? 9 : 5}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "hello-err-message" : undefined}
                    placeholder="Here's what's on my heart…"
                    value={form.message}
                    onChange={(e) => set("message")(e.target.value)}
                  />
                </label>

                <p className="hello-letter__sign" aria-hidden>
                  <span>With thanks,</span>
                  {signature ? <span className="hello-letter__signature">{signature}</span> : null}
                </p>

                {Object.values(errors).some(Boolean) || serverError ? (
                  <ul className="hello-letter__errors" role="alert">
                    {errors.name ? <li id="hello-err-name">{errors.name}</li> : null}
                    {errors.email ? <li id="hello-err-email">{errors.email}</li> : null}
                    {errors.message ? <li id="hello-err-message">{errors.message}</li> : null}
                    {serverError ? <li>{serverError}</li> : null}
                  </ul>
                ) : null}

                <div className="hello-letter__send">
                  <button type="submit" className="btn-primary" disabled={busy}>
                    {busy ? "Sending…" : "Send my message"}
                  </button>
                  <p>
                    Rather talk face to face? Find a member of the team at the admin desk after any
                    service.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>

        <aside className="hello-write__aside" aria-label="What happens next">
          <figure className="hello-write__photo">
            <Image
              src="https://images.kharis.org/site-images/main/67210f0fba54b6a1/contact/after-service-conversation.jpg"
              alt="Two women talking after a Sunday service"
              fill
              sizes="(max-width: 1023px) 92vw, 34vw"
            />
            <figcaption>After a Sunday service</figcaption>
          </figure>

          <ol className="hello-steps">
            <li>
              <span className="hello-steps__num" aria-hidden>
                01
              </span>
              <h3>You write</h3>
              <p>
                A few lines is plenty. Visiting, praying, hurting or curious, it all belongs here.
              </p>
            </li>
            <li>
              <span className="hello-steps__num" aria-hidden>
                02
              </span>
              <h3>It reaches the team</h3>
              <p>Your message arrives with the Kharis team, marked for the branch you picked.</p>
            </li>
            <li>
              <span className="hello-steps__num" aria-hidden>
                03
              </span>
              <h3>We write back</h3>
              <p>
                Look out for a reply by email. Visiting? We&apos;ll help you find your way on
                Sunday.
              </p>
            </li>
          </ol>
        </aside>
      </div>
    </section>
  );
}
