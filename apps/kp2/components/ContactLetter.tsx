"use client";

import { KP2_PHOTOS } from "@/lib/photography";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/base-path";
import { CONTACT_TOPICS } from "@/lib/contact";
import "./contact-letter.css";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

const EMPTY = { name: "", email: "", phone: "", topic: "Sunday visit", message: "", branch: "" };

function check(form: typeof EMPTY): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = "Add your name so we know who to write back to.";
  if (!EMAIL.test(form.email.trim())) errors.email = "That email address doesn't look right.";
  if (form.message.trim().length < 8) errors.message = "Add a line or two so we know how to help.";
  return errors;
}

export function ContactLetter({
  branches,
  fallbackEmail,
}: {
  branches: { slug: string; name: string }[];
  fallbackEmail?: string;
}) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<{ first: string; email: string } | null>(null);
  const thanksRef = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<Partial<Record<Field, HTMLElement | null>>>({});

  useEffect(() => {
    if (sent) thanksRef.current?.focus();
  }, [sent]);

  const set = (key: keyof typeof EMPTY) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
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
    try {
      const res = await fetch(withBasePath("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email.trim(),
          phone: form.phone.trim(),
          topic: form.topic,
          branch: form.branch,
          message: form.message,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setServerError(data.error || "We couldn't send that just now. Please try again.");
        return;
      }
      setSent({ first: form.name.trim().split(/\s+/)[0] ?? "", email: form.email.trim() });
      setForm(EMPTY);
    } catch {
      setServerError("We couldn't reach Kharis just now. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const signature = form.name.trim().split(/\s+/)[0];

  return (
    <section id="write" className="kp-write" aria-labelledby="kp-write-title">
      <div className="kp-write__inner">
        <div>
          <header className="kp-write__head">
            <p className="kp-write__eyebrow">Write to us</p>
            <h2 id="kp-write-title" className="kp-write__title">
              Start with a <em>few lines.</em>
            </h2>
            <p className="kp-write__sub">
              Tell us what&apos;s on your heart. Your message goes to the Kharis Phase 2 team,
              marked for the branch you choose.
            </p>
          </header>

          <div className="kp-letter">
            {sent ? (
              <div ref={thanksRef} tabIndex={-1} className="kp-letter__thanks" role="status">
                <span className="kp-letter__burst" aria-hidden="true">
                  Sent!
                </span>
                <p className="kp-letter__thanks-title">
                  Thank you{sent.first ? `, ${sent.first}` : ""}.
                </p>
                <p>
                  Your message is with the Kharis Phase 2 team. We&apos;ll reply to{" "}
                  <strong>{sent.email}</strong>.
                </p>
                <button type="button" className="kp-letter__link" onClick={() => setSent(null)}>
                  Write another message
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <p className="kp-letter__greeting">Hi Kharis,</p>

                <p className="kp-letter__line">
                  My name is{" "}
                  <span className="kp-letter__tie">
                    <input
                      ref={(el) => {
                        fieldRefs.current.name = el;
                      }}
                      className="kp-field kp-field--name"
                      aria-label="Your name"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "kp-err-name" : undefined}
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
                    className="kp-field kp-field--email"
                    type="email"
                    inputMode="email"
                    aria-label="Your email address"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "kp-err-email" : undefined}
                    autoComplete="email"
                    placeholder="email address"
                    value={form.email}
                    onChange={(e) => set("email")(e.target.value)}
                  />{" "}
                  <span className="kp-letter__tie">
                    or on{" "}
                    <input
                      className="kp-field kp-field--phone"
                      type="tel"
                      aria-label="Your phone number (optional)"
                      autoComplete="tel"
                      placeholder="phone, optional"
                      value={form.phone}
                      onChange={(e) => set("phone")(e.target.value)}
                    />
                    .
                  </span>
                </p>

                <p className="kp-letter__line">
                  I&apos;m getting in touch about{" "}
                  <span className="kp-letter__tie">
                    <select
                      className="kp-field kp-field--select"
                      aria-label="What your message is about"
                      value={form.topic}
                      onChange={(e) => set("topic")(e.target.value)}
                    >
                      {CONTACT_TOPICS.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    ,
                  </span>{" "}
                  and the branch I have in mind is{" "}
                  <span className="kp-letter__tie">
                    <select
                      className="kp-field kp-field--select"
                      aria-label="Branch"
                      value={form.branch}
                      onChange={(e) => set("branch")(e.target.value)}
                    >
                      <option value="">not decided yet</option>
                      {branches.map((b) => (
                        <option key={b.slug} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    .
                  </span>
                </p>

                <label className="kp-letter__message">
                  <span className="sr-only">Your message</span>
                  <textarea
                    ref={(el) => {
                      fieldRefs.current.message = el;
                    }}
                    rows={5}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "kp-err-message" : undefined}
                    placeholder="Here's what's on my heart…"
                    value={form.message}
                    onChange={(e) => set("message")(e.target.value)}
                  />
                </label>

                <p className="kp-letter__sign" aria-hidden="true">
                  <span>With thanks,</span>
                  {signature ? <span className="kp-letter__signature">{signature}</span> : null}
                </p>

                {Object.values(errors).some(Boolean) || serverError ? (
                  <ul className="kp-letter__errors" role="alert">
                    {errors.name ? <li id="kp-err-name">{errors.name}</li> : null}
                    {errors.email ? <li id="kp-err-email">{errors.email}</li> : null}
                    {errors.message ? <li id="kp-err-message">{errors.message}</li> : null}
                    {serverError ? (
                      <li>
                        {serverError}
                        {fallbackEmail ? (
                          <>
                            {" "}
                            You can also email{" "}
                            <a href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>.
                          </>
                        ) : null}
                      </li>
                    ) : null}
                  </ul>
                ) : null}

                <div className="kp-letter__send">
                  <button type="submit" className="kp-letter__button" disabled={busy}>
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

        <aside className="kp-write__aside" aria-label="What happens next">
          <figure className="kp-write__photo">
            <img
              src={KP2_PHOTOS.serviceTogether.src}
              alt={KP2_PHOTOS.serviceTogether.alt}
              loading="lazy"
              decoding="async"
            />
            <figcaption>After a Sunday service</figcaption>
          </figure>

          <ol className="kp-steps">
            <li>
              <span className="kp-steps__num" aria-hidden="true">
                01
              </span>
              <div>
                <h3>You write</h3>
                <p>
                  A few lines is plenty. Visiting, praying, hurting or curious, it all belongs here.
                </p>
              </div>
            </li>
            <li>
              <span className="kp-steps__num" aria-hidden="true">
                02
              </span>
              <div>
                <h3>It reaches the team</h3>
                <p>Your message arrives with the KP2 team, marked for the branch you picked.</p>
              </div>
            </li>
            <li>
              <span className="kp-steps__num" aria-hidden="true">
                03
              </span>
              <div>
                <h3>We write back</h3>
                <p>
                  Look out for a reply by email. Visiting? We&apos;ll help you find your way on
                  Sunday.
                </p>
              </div>
            </li>
          </ol>
        </aside>
      </div>
    </section>
  );
}
