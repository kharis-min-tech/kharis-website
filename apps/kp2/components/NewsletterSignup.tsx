"use client";

import { useState, type FormEvent } from "react";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

type NewsletterSignupProps = {
  title: string;
  copy: string;
  placeholder?: string;
  cta?: string;
  className?: string;
  copyClassName?: string;
  buttonClassName?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterSignup({
  title,
  copy,
  placeholder = "YOUR EMAIL ADDRESS",
  cta = "Subscribe",
  className,
  copyClassName,
  buttonClassName,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    if (!EMAIL.test(email.trim())) {
      setError("That email address doesn't look right.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch(withBasePath("/api/newsletter"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "We couldn't save that just now. Please try again.");
        return;
      }
      setSent(true);
      setEmail("");
    } catch {
      setError("We couldn't reach Kharis just now. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="relative z-10 py-stack-lg">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div
          className={cn(
            "relative overflow-hidden rounded-none border-2 border-black neo-shadow p-stack-md",
            className,
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 halftone-pattern opacity-10"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="mb-4 font-headline-lg text-headline-lg uppercase leading-tight">
              {title}
            </h2>
            <p className={cn("mb-stack-md font-body-lg text-body-lg", copyClassName)}>{copy}</p>
            {sent ? (
              <p className="font-body-lg" role="status">
                You&apos;re on the list. We&apos;ll write to you from Kharis Phase 2.
              </p>
            ) : (
              <form className="flex flex-col gap-4 md:flex-row" onSubmit={onSubmit}>
                <label className="flex-grow">
                  <span className="sr-only">Email address</span>
                  <input
                    className="w-full rounded-none border-2 border-black bg-surface p-4 font-label-md text-on-background outline-none focus:ring-4 focus:ring-primary"
                    placeholder={placeholder}
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </label>
                <button
                  type="submit"
                  disabled={busy}
                  className={cn(
                    "shrink-0 rounded-none border-2 border-black bg-on-background px-8 py-4 font-headline-md uppercase text-surface neo-shadow transition-all hover-press disabled:opacity-60",
                    buttonClassName,
                  )}
                >
                  {busy ? "Saving…" : cta}
                </button>
              </form>
            )}
            {error ? <p className="mt-3 font-body-md text-sm text-[#9b1c1c]">{error}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
