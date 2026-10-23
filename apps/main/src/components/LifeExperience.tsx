"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon";
import { LIFE_MEMBERSHIP_URL } from "@/lib/life-content";
import { lifeBySlug, type LifeSlug } from "@/lib/life-content";
import { LifeDetailModal } from "@/components/LifeDetailModal";
import { BelongStory } from "@/components/BelongStory";
import { CommunityDoors } from "@/components/CommunityDoors";
import { LifeCloserMarquee } from "@/components/LifeCloserMarquee";
import { useReducedMotion } from "framer-motion";
import { usePageSnap } from "@/lib/page-snap";
import "./life-refresh.css";
import "./life-alone.css";

function CloserPanel() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [savedLocally, setSavedLocally] = useState(false);
  const [error, setError] = useState("");
  const [emailAttempted, setEmailAttempted] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailAttempted(true);
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setBusy(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Kharis Life visitor",
          email: email.trim(),
          topic: "General",
          message:
            "I'd like to get plugged into Kharis Life. Please connect me with next steps at my local branch.",
        }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        storage?: string;
      };
      if (!response.ok || !result.ok) {
        setError(result.error || "Please check your email and try again.");
        return;
      }
      setSavedLocally(result.storage === "local-development");
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="life-alone" aria-labelledby="life-refresh-closer-title">
      {/* The marquee repeats the headline for show; screen readers get it once from the h2. */}
      <h2 id="life-refresh-closer-title" className="sr-only">
        Don&apos;t do life alone
      </h2>
      <LifeCloserMarquee text="DON'T DO LIFE ALONE" />

      <div className="life-alone__row">
        <p className="life-alone__copy">
          Whether you are ready for baptism, wanting to serve in the house, or looking for a place
          to belong, there is space for you here.
        </p>
        <div className="life-alone__action">
          {sent ? (
            <p className="life-alone__success" role="status">
              {savedLocally
                ? "Thanks for reaching out. Someone from your local Kharis branch will be in touch soon."
                : "Thank you. We'll connect you with a local branch."}
            </p>
          ) : (
            <form className="life-alone__form" onSubmit={onSubmit} noValidate>
              <label className="sr-only" htmlFor="life-refresh-email">
                Your email address
              </label>
              <input
                id="life-refresh-email"
                type="email"
                required
                autoComplete="email"
                placeholder="Your email address"
                value={email}
                aria-invalid={emailAttempted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())}
                aria-describedby={error ? "life-refresh-email-error" : undefined}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError("");
                }}
              />
              <button type="submit" className="life-alone__button" disabled={busy}>
                {busy ? "Sending…" : "GET PLUGGED IN"}
                <Icon name="arrow" className="h-4 w-4" />
              </button>
              {error ? (
                <p id="life-refresh-email-error" className="life-alone__error" role="alert">
                  {error}
                </p>
              ) : null}
            </form>
          )}
          <p className="life-alone__note">
            We&apos;ll connect you with a local branch, or{" "}
            <a href={LIFE_MEMBERSHIP_URL}>BECOME A MEMBER</a> when you&apos;re ready.
          </p>
        </div>
      </div>
    </section>
  );
}

export function LifeExperience() {
  /* Snap between the page's scroll stages (sections declare points with data-snap). */
  const reduceMotion = useReducedMotion();
  usePageSnap(!reduceMotion);
  const [modalSlug, setModalSlug] = useState<LifeSlug | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("open");
    if (slug === "departments") {
      window.location.replace("/life/departments");
      return;
    }
    if (slug === "baptism" || slug === "fasting" || slug === "marriage" || slug === "k-group") {
      setModalSlug(slug);
    }
  }, []);

  const openModal = useCallback((slug: "baptism" | "fasting") => {
    setModalSlug(slug);
    const url = new URL(window.location.href);
    url.searchParams.set("open", slug);
    window.history.replaceState(null, "", url);
  }, []);

  const closeModal = useCallback(() => {
    setModalSlug(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("open");
    window.history.replaceState(null, "", url);
  }, []);

  const modalCategory = modalSlug ? (lifeBySlug(modalSlug) ?? null) : null;

  return (
    <div className="life-refresh">
      <CommunityDoors />

      <BelongStory onLearnMore={openModal} />

      <CloserPanel />
      <LifeDetailModal category={modalCategory} onClose={closeModal} />
    </div>
  );
}
