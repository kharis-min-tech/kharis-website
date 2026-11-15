"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Check, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useDialog } from "@/lib/use-dialog";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { HONEYPOT_FIELD, TURNSTILE_FIELD } from "../../../../shared/form-fields";
import { HoneypotField, useTurnstile } from "../../../../shared/form-widgets";

interface PlanVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchName?: string;
  branchCity?: string;
  eventLabel?: string | null;
}

export default function PlanVisitModal({
  isOpen,
  onClose,
  branchName,
  branchCity,
  eventLabel,
}: PlanVisitModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("Next Sunday");
  const [children, setChildren] = useState(false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const turnstile = useTurnstile("visit");

  const dialogRef = useDialog(isOpen, onClose);
  const reduce = usePrefersReducedMotion();
  const closeTimer = useRef<number | null>(null);
  const request = useRef<AbortController | null>(null);
  useEffect(() => {
    if (!isOpen) {
      setIsSubmitted(false);
      setError("");
    }
  }, [isOpen]);
  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      request.current?.abort();
    },
    [isOpen],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    if (!consent) {
      setError("Please confirm the branch can contact you about this visit.");
      return;
    }
    setBusy(true);
    setError("");

    try {
      request.current = new AbortController();
      const res = await fetch("/api/visit", {
        method: "POST",
        signal: request.current.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [HONEYPOT_FIELD]: honeypot,
          [TURNSTILE_FIELD]: turnstile.token,
          name,
          email,
          phone,
          branch: branchName || branchCity || "",
          gathering: eventLabel || date,
          children,
          consent,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setIsSubmitted(true);
      closeTimer.current = window.setTimeout(() => {
        setIsSubmitted(false);
        setName("");
        setEmail("");
        setPhone("");
        setChildren(false);
        setConsent(false);
        onClose();
      }, 2400);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setError("Something went wrong. Please try the contact page.");
    } finally {
      turnstile.reset();
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.18 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="plan-visit-title"
            tabIndex={-1}
            initial={reduce ? false : { opacity: 0, scale: 0.98, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.985, y: 12 }}
            transition={{ duration: reduce ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[var(--surface-raised)] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[var(--line)] relative max-h-[90svh] overflow-y-auto "
          >
            <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-[var(--purple)] text-white shadow-md shadow-[var(--purple)]/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  {/* Was text-white, which only worked while this panel was
                      hardcoded dark. It follows the theme now, so the title
                      has to take the page's ink or it is white on white. */}
                  <h3 id="plan-visit-title" className="font-extrabold text-xl text-[var(--fg)]!">
                    Plan Your Visit
                  </h3>
                  <p className="text-xs font-semibold text-[var(--muted)]">
                    {branchName
                      ? `We are excited to host you at ${branchName}.`
                      : "We are excited to host you and your family."}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close visit form"
                className="p-2 text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-1)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-[var(--purple)]/20 text-[var(--purple)] mx-auto flex items-center justify-center">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h4 className="text-2xl font-extrabold text-[var(--fg)]">
                  You are all set, {name.split(" ")[0]}!
                </h4>
                <p className="text-sm font-semibold text-[var(--muted)] max-w-sm mx-auto">
                  Our host team has your details and will follow up before your visit.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div>
                  <label
                    htmlFor="visit-name"
                    className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-soft)] mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="visit-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-4 py-3 border border-[var(--line)] bg-[var(--surface-1)] text-sm font-bold text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--purple)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="visit-email"
                    className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-soft)] mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="visit-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sarah@example.com"
                    className="w-full px-4 py-3 border border-[var(--line)] bg-[var(--surface-1)] text-sm font-bold text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--purple)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="visit-phone"
                    className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-soft)] mb-1"
                  >
                    Phone (optional)
                  </label>
                  <input
                    id="visit-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 7000 000000"
                    className="w-full px-4 py-3 border border-[var(--line)] bg-[var(--surface-1)] text-sm font-bold text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--purple)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="visit-gathering"
                    className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-soft)] mb-1"
                  >
                    Which service will you be attending?
                  </label>
                  <select
                    id="visit-gathering"
                    value={eventLabel || date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--line)] bg-[var(--surface-1)] text-sm font-bold text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--purple)]"
                  >
                    {eventLabel ? <option value={eventLabel}>{eventLabel}</option> : null}
                    <option value="Next Sunday">Next Sunday service</option>
                    <option value="Midweek">Midweek gathering</option>
                    <option value="Other">Other / not sure yet</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[var(--surface-1)] border border-[var(--line)]">
                  <input
                    type="checkbox"
                    id="kids"
                    checked={children}
                    onChange={(e) => setChildren(e.target.checked)}
                    className="w-4 h-4 text-[var(--purple)] focus:ring-[var(--purple)] bg-[var(--surface-raised)] border-[var(--line)]"
                  />
                  <label
                    htmlFor="kids"
                    className="text-xs font-bold text-[var(--fg)] cursor-pointer"
                  >
                    I will be bringing children (ages 0-12) for the Children&apos;s Ministry.
                  </label>
                </div>

                {error ? <p className="text-xs font-semibold text-[#ff8a8a]">{error}</p> : null}

                {turnstile.widget}
                <HoneypotField value={honeypot} onChange={setHoneypot} />
                <button
                  type="submit"
                  disabled={busy || !consent}
                  className="k-cta w-full py-4 bg-[var(--purple)] hover:bg-[var(--purple-deep)] text-white font-extrabold text-base shadow-lg shadow-[var(--purple)]/30 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                >
                  <span>{busy ? "Sending…" : "Confirm my visit"}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
