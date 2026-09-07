"use client";

import { FormEvent, useCallback, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { LifeDetailModal } from "@/components/LifeDetailModal";
import { LifeIcon } from "@/components/LifeIcon";
import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";
import {
  LIFE_CATEGORIES,
  LIFE_DEPARTMENTS_URL,
  LIFE_HERO,
  LIFE_MEMBERSHIP_URL,
  LIFE_PHOTO_CARDS,
  lifeBySlug,
  type LifeCategory,
  type LifeSlug,
} from "@/lib/life-content";

const MODAL_SLUGS = new Set<LifeSlug>([
  "k-group",
  "baptism",
  "fasting",
  "marriage",
]);

function LearnMore({
  card,
  onOpen,
}: {
  card: LifeCategory;
  onOpen: (slug: LifeSlug) => void;
}) {
  if (card.slug === "children") {
    return (
      <Link href={card.href} className="life-cta">
        Learn More
        <Icon name="arrow" className="h-3.5 w-3.5" />
      </Link>
    );
  }

  if (card.slug === "departments") {
    return (
      <a
        href={LIFE_DEPARTMENTS_URL}
        className="life-cta"
        target="_blank"
        rel="noreferrer"
      >
        Learn More
        <Icon name="arrow" className="h-3.5 w-3.5" />
      </a>
    );
  }

  return (
    <button
      type="button"
      className="life-cta"
      onClick={() => onOpen(card.slug)}
    >
      Learn More
      <Icon name="arrow" className="h-3.5 w-3.5" />
    </button>
  );
}

function PhotoCard({
  card,
  onOpen,
}: {
  card: LifeCategory;
  onOpen: (slug: LifeSlug) => void;
}) {
  return (
    <article className={`life-card life-card--${card.tone}`}>
      <div className="life-card__media">
        <Image
          src={card.image}
          alt={card.imageAlt}
          fill
          unoptimized={card.image.startsWith("/images/")}
          sizes="(max-width: 800px) 100vw, 50vw"
          className="object-cover object-[center_42%]"
        />
        <span className="life-card__badge">{card.badge}</span>
      </div>
      <div className="life-card__body">
        <div className="life-card__title-row">
          <LifeIcon name={card.icon} className="life-card__ico" />
          <h3>{card.shortTitle}</h3>
        </div>
        <p>{card.card}</p>
        <LearnMore card={card} onOpen={onOpen} />
      </div>
    </article>
  );
}

function TextCard({
  card,
  extra,
  onOpen,
}: {
  card: LifeCategory;
  extra?: ReactNode;
  onOpen: (slug: LifeSlug) => void;
}) {
  return (
    <article className={`life-textcard life-textcard--${card.tone}`}>
      <div className="life-card__title-row">
        <LifeIcon name={card.icon} className="life-card__ico" />
        <h3>{card.shortTitle}</h3>
      </div>
      <p>{card.card}</p>
      {extra}
      <LearnMore card={card} onOpen={onOpen} />
    </article>
  );
}

function KidsCard({ onOpen }: { onOpen: (slug: LifeSlug) => void }) {
  const kids = LIFE_CATEGORIES.find((c) => c.slug === "children")!;
  return (
    <article className="life-kids">
      <div className="life-kids__blend" aria-hidden>
        <span
          className="life-kids__photo life-kids__photo--a"
          style={{ backgroundImage: "url(/images/young-adults.jpg)" }}
        />
        <span
          className="life-kids__photo life-kids__photo--b"
          style={{ backgroundImage: "url(/images/branch-slide-1.jpg)" }}
        />
        <span
          className="life-kids__photo life-kids__photo--c"
          style={{ backgroundImage: "url(/images/testimony-1.jpg)" }}
        />
      </div>
      <div className="life-kids__copy">
        <span className="life-card__badge">{kids.badge}</span>
        <div className="life-card__title-row">
          <LifeIcon name={kids.icon} className="life-card__ico" />
          <h3>{kids.title}</h3>
        </div>
        <p>{kids.card}</p>
        <LearnMore card={kids} onOpen={onOpen} />
      </div>
    </article>
  );
}

function CloserPanel() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const local = email.split("@")[0]?.replace(/[^\w.-]/g, " ") || "Friend";
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first: local,
          last: "Life",
          email,
          topic: "General",
          message:
            "I'd like to get plugged into Kharis Life. Please connect me with a K-Group and next steps at my local branch.",
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Please check your email and try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Something went wrong. You can also reach us on the contact page.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="life-closer__panel">
      <h2 id="life-closer-title">Don&apos;t do life alone</h2>
      <p>
        Whether you&apos;re looking for a K-Group, ready for baptism, or
        wanting to serve in the house, there&apos;s a space for you here.
      </p>
      {sent ? (
        <p className="life-closer__thanks">
          Thank you. We&apos;ll be in touch. You can also{" "}
          <Link href="/contact">message us directly</Link> or{" "}
          <a href={LIFE_MEMBERSHIP_URL}>become a member</a>.
        </p>
      ) : (
        <form className="life-closer__form" onSubmit={onSubmit}>
          <label className="sr-only" htmlFor="life-email">
            Your email address
          </label>
          <input
            id="life-email"
            type="email"
            required
            autoComplete="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="life-cta" disabled={busy}>
            {busy ? "Sending…" : "Get plugged in"}
          </button>
          {error ? <p className="life-closer__err">{error}</p> : null}
        </form>
      )}
      <p className="life-closer__note">
        We&apos;ll connect you with a local branch, or{" "}
        <a href={LIFE_MEMBERSHIP_URL}>become a member</a> when you&apos;re
        ready.
      </p>
    </div>
  );
}

type Props = {
  baptismVideoId?: string;
};

export function LifeExperience({ baptismVideoId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [modalSlug, setModalSlug] = useState<LifeSlug | null>(null);

  const openModal = useCallback(
    (slug: LifeSlug) => {
      if (!MODAL_SLUGS.has(slug)) return;
      setModalSlug(slug);
      const url = new URL(window.location.href);
      url.searchParams.set("open", slug);
      router.replace(url.pathname + url.search, { scroll: false });
    },
    [router],
  );

  const closeModal = useCallback(() => {
    setModalSlug(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("open");
    const next = url.search ? url.pathname + url.search : url.pathname;
    router.replace(next, { scroll: false });
  }, [router]);

  useEffect(() => {
    const open = searchParams.get("open");
    if (open === "departments") {
      window.location.assign(LIFE_DEPARTMENTS_URL);
      return;
    }
    if (open && MODAL_SLUGS.has(open as LifeSlug)) {
      setModalSlug(open as LifeSlug);
    }
  }, [searchParams]);

  const fasting = LIFE_CATEGORIES.find((c) => c.slug === "fasting")!;
  const marriage = LIFE_CATEGORIES.find((c) => c.slug === "marriage")!;
  const modalCategory = modalSlug ? lifeBySlug(modalSlug) ?? null : null;

  return (
    <div className="life-page">
      <div className="life-wrap">
        <section className="life-hero" aria-labelledby="life-hero-title">
          <div className="life-hero__inner">
            <Reveal variant="blur" className="life-hero__copy">
              <p className="life-hero__eyebrow">{LIFE_HERO.eyebrow}</p>
              <h1 id="life-hero-title">{LIFE_HERO.title}</h1>
              <p className="life-hero__body">{LIFE_HERO.body}</p>
              <div className="life-hero__actions">
                <button
                  type="button"
                  className="life-cta"
                  onClick={() => openModal("baptism")}
                >
                  Start with baptism
                  <Icon name="arrow" className="h-3.5 w-3.5" />
                </button>
                <Link href="/events" className="life-cta life-cta--ghost">
                  Upcoming events
                </Link>
              </div>
            </Reveal>

            <Reveal variant="right" className="life-hero__visual">
              <motion.div
                className="life-hero__frame"
                initial={{ rotate: 2.5 }}
                whileHover={{ rotate: 0.5, y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Image
                  src={LIFE_HERO.image}
                  alt={LIFE_HERO.imageAlt}
                  fill
                  unoptimized
                  priority
                  sizes="(max-width: 900px) 90vw, 48vw"
                  className="object-cover object-[center_58%]"
                />
              </motion.div>
              <p className="life-hero__sticky">{LIFE_HERO.sticky}</p>
            </Reveal>
          </div>
          <p className="life-hero__banner">
            {LIFE_HERO.banner}
            <span>, {LIFE_HERO.quoteSource}</span>
          </p>
        </section>

        <section className="life-grid" aria-labelledby="life-grid-title">
          <Reveal variant="blur" className="life-grid__intro">
            <p className="life-grid__eyebrow">A one-another life</p>
            <h2 id="life-grid-title">
              <span className="life-grid__bar" aria-hidden />
              Belong in the family
              <span className="life-grid__bar" aria-hidden />
            </h2>
            <p>
              The Church is a place for feeding on God&apos;s Word, fellowship and
              accountability. Meet the arms of Kharis Life, and take a next
              step that fits where you are.
            </p>
          </Reveal>

          <RevealStagger className="life-grid__cards" stagger={0.08}>
            {LIFE_PHOTO_CARDS.map((card) => (
              <RevealItem key={card.slug} variant="up">
                <PhotoCard card={card} onOpen={openModal} />
              </RevealItem>
            ))}
          </RevealStagger>
        </section>

        <section className="life-mixed" aria-label="More of Kharis Life">
          <RevealStagger className="life-mixed__grid" stagger={0.07}>
            <RevealItem variant="up">
              <TextCard card={fasting} onOpen={openModal} />
            </RevealItem>
            <RevealItem variant="up">
              <TextCard card={marriage} onOpen={openModal} />
            </RevealItem>
            <RevealItem variant="scale" className="life-mixed__kids">
              <KidsCard onOpen={openModal} />
            </RevealItem>
            <RevealItem variant="up" className="life-mixed__closer">
              <CloserPanel />
            </RevealItem>
          </RevealStagger>
        </section>
      </div>

      <LifeDetailModal
        category={modalCategory}
        baptismVideoId={baptismVideoId}
        onClose={closeModal}
      />
    </div>
  );
}
