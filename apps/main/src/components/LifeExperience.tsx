"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Image from "@/components/SiteImage";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { LIFE_MEMBERSHIP_URL } from "@/lib/life-content";
import { lifeBySlug, type LifeSlug } from "@/lib/life-content";
import { LifeDetailModal } from "@/components/LifeDetailModal";
import { BelongStory } from "@/components/BelongStory";
import "./life-refresh.css";

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
    <section className="life-refresh-closer" aria-labelledby="life-refresh-closer-title">
      <div className="life-refresh-closer__copy">
        <h2 id="life-refresh-closer-title">DON&apos;T DO LIFE ALONE</h2>
        <p>
          Whether you are ready for baptism, wanting to serve in the house, or looking for a place
          to belong, there is space for you here.
        </p>
      </div>
      {sent ? (
        <p className="life-refresh-closer__success" role="status">
          {savedLocally
            ? "Thanks for reaching out. Someone from your local Kharis branch will be in touch soon."
            : "Thank you. We'll connect you with a local branch."}
        </p>
      ) : (
        <form className="life-refresh-closer__form" onSubmit={onSubmit} noValidate>
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
          <button type="submit" className="life-refresh__button" disabled={busy}>
            {busy ? "Sending…" : "GET PLUGGED IN"}
            <Icon name="arrow" className="h-4 w-4" />
          </button>
          {error ? (
            <p id="life-refresh-email-error" className="life-refresh-closer__error" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      )}
      <p className="life-refresh-closer__note">
        We&apos;ll connect you with a local branch, or{" "}
        <a href={LIFE_MEMBERSHIP_URL}>BECOME A MEMBER</a> when you&apos;re ready.
      </p>
    </section>
  );
}

export function LifeExperience() {
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
      <section className="life-refresh-hero" aria-labelledby="life-refresh-title">
        <div className="life-refresh-hero__copy">
          <p className="life-refresh__eyebrow">COMMUNITY FIRST</p>
          <h1 id="life-refresh-title">KHARIS LIFE</h1>
          <p className="life-refresh-hero__body">
            The Christian life is a one-another life. Believe, become, and belong. Grow in the Word,
            find your people, and live out your faith in the Kharis family.
          </p>
          <Link href="/locations" className="life-refresh__button">
            PLAN A VISIT <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
        <div className="life-refresh-hero__visual">
          <div className="life-refresh-hero__photo">
            <Image
              src="/images/join-family-community.jpg"
              alt="The Kharis congregation gathered together"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 54vw"
              className="object-cover object-[center_58%]"
            />
          </div>
          <p className="life-refresh-hero__sticker">PLAN A VISIT. WE&apos;D LOVE TO MEET YOU.</p>
        </div>
        <p className="life-refresh-hero__strip">
          A ONE-ANOTHER LIFE. BELONG HERE, <span>David Antwi</span>
        </p>
      </section>

      <BelongStory onLearnMore={openModal} />

      <CloserPanel />
      <LifeDetailModal category={modalCategory} onClose={closeModal} />
    </div>
  );
}
