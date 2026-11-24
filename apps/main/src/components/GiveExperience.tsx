"use client";

import Image from "@/components/SiteImage";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BatteryFull,
  ChevronLeft,
  Plus,
  SignalHigh,
  UserRound,
  Wifi,
} from "lucide-react";
import { CopyRow } from "@/components/GiveCopyRow";
import { BANK, TEXT_GIVE, type GivingBranch } from "@/lib/giving";
import { SPURGEONS_CENTRE } from "@/lib/spurgeons";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import "./give.css";

const TEXT_AMOUNTS = [5, 10, 15, 20] as const;
const BRANCH_KEY = "kharis-give-branch";

/**
 * Three ways anyone can give. "From Ghana" used to be a fourth, which put a
 * single branch's bank details beside three options open to everybody; it
 * lives at /give/accra now, reached by picking Accra from the branch list
 * below, exactly as every other branch is reached.
 */
const WAYS = [
  { id: "online", label: "Online", hint: "By card, through your branch" },
  { id: "bank", label: "Bank transfer", hint: "One-off or monthly, from the UK" },
  { id: "text", label: "Text", hint: `UK mobiles, up to £${TEXT_GIVE.maxPounds}` },
] as const;

type Way = (typeof WAYS)[number]["id"];

/** Short name for the give button: "Kharis Church London" reads as "London". */
function shortName(branch: GivingBranch) {
  return branch.name.replace(/^Kharis Church /, "").replace(/^Kharis Phase 2 /, "KP2 ");
}

function OnlinePanel({ branches }: { branches: GivingBranch[] }) {
  const [picked, setPicked] = useState("");
  const branch = branches.find((b) => b.name === picked);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(BRANCH_KEY);
      if (saved && branches.some((b) => b.name === saved)) setPicked(saved);
    } catch {
      // Storage can be blocked; the picker simply starts empty.
    }
  }, [branches]);

  const choose = (name: string) => {
    setPicked(name);
    try {
      window.localStorage.setItem(BRANCH_KEY, name);
    } catch {
      // Not remembering the branch is fine.
    }
  };

  return (
    <>
      <h3>Give to your branch online</h3>
      <p className="gv-panel__lede">
        Pick your branch and you&apos;ll go straight to its secure giving page.
      </p>
      <label className="gv-select">
        <span>Your branch</span>
        <select value={picked} onChange={(e) => choose(e.target.value)}>
          <option value="" disabled>
            Choose a branch
          </option>
          {branches.map((b) => (
            <option key={b.name} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
      </label>

      <div className="gv-panel__action">
        {!branch ? (
          <span className="btn-give gv-btn-off" aria-disabled>
            Choose your branch first
          </span>
        ) : branch.kind === "online" ? (
          <a href={branch.url} target="_blank" rel="noopener noreferrer" className="btn-give">
            Give to {shortName(branch)}
            <ArrowUpRight aria-hidden className="h-4 w-4" />
          </a>
        ) : branch.kind === "ghana" ? (
          /* Accra has no card page of its own, so this goes to the page that
           * carries its CalBank and Mobile Money details. A link, not a
           * navigation fired by the select changing: arrowing through a
           * native select fires change on every option it passes, which
           * would throw a keyboard user off this page at "Accra". */
          <>
            <Link href="/give/accra" className="btn-give">
              Give to {shortName(branch)}
              <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
            <p className="gv-panel__note">Accra gives by CalBank transfer or Mobile Money.</p>
          </>
        ) : (
          <a
            href={SPURGEONS_CENTRE.giveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-give"
          >
            Give to the {SPURGEONS_CENTRE.publicName}
            <ArrowUpRight aria-hidden className="h-4 w-4" />
          </a>
        )}
      </div>
    </>
  );
}

function BankPanel() {
  return (
    <>
      <h3>Bank transfer</h3>
      <p className="gv-panel__lede">
        Use these details in your banking app. To give every month, set them up as a standing order.
      </p>
      <dl className="gv-rows">
        <CopyRow label="Account name" value={BANK.accountName} />
        <CopyRow label="Account number" value={BANK.accountNumber} />
        <CopyRow label="Sort code" value={BANK.sortCode} />
        <CopyRow label="IBAN" value={BANK.iban} />
        <CopyRow label="SWIFT / BIC" value={BANK.swift} />
      </dl>
    </>
  );
}

function TextPanel() {
  const [amount, setAmount] = useState<(typeof TEXT_AMOUNTS)[number]>(10);
  const message = `${TEXT_GIVE.keyword} ${amount}`;
  const smsHref = `sms:${TEXT_GIVE.number}?&body=${encodeURIComponent(message)}`;

  return (
    <div className="gv-text">
      <div>
        <h3>Text to give</h3>
        <p className="gv-panel__lede">
          Text <strong>{TEXT_GIVE.keyword}</strong> and the amount to{" "}
          <strong>{TEXT_GIVE.number}</strong>. It&apos;s added to your next phone bill or taken from
          your pay‑as‑you‑go balance.
        </p>
        <div className="gv-amounts" role="radiogroup" aria-label="Amount to give">
          {TEXT_AMOUNTS.map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={amount === n}
              className={`gv-amounts__chip${amount === n ? " is-on" : ""}`}
              onClick={() => setAmount(n)}
            >
              £{n}
            </button>
          ))}
        </div>
        <div className="gv-panel__action">
          <a href={smsHref} className="btn-give">
            Text {message} to {TEXT_GIVE.number}
          </a>
        </div>
        <p className="gv-panel__note">UK mobiles only. Up to £{TEXT_GIVE.maxPounds} per text.</p>
      </div>

      <div className="gv-phone" aria-hidden>
        <div className="gv-phone__screen">
          <div className="gv-phone__status">
            <span>10:42</span>
            <span className="gv-phone__island" />
            <span className="gv-phone__icons">
              <SignalHigh />
              <Wifi />
              <BatteryFull />
            </span>
          </div>
          <div className="gv-phone__head">
            <ChevronLeft className="gv-phone__back" />
            <span className="gv-phone__avatar">
              <UserRound />
            </span>
            <span className="gv-phone__name">{TEXT_GIVE.number}</span>
          </div>
          <div className="gv-phone__thread">
            <p className="gv-phone__meta">
              Text Message
              <br />
              Today 10:42
            </p>
            <p key={amount} className="gv-phone__bubble">
              {message}
            </p>
            <p className="gv-phone__receipt">Delivered</p>
          </div>
          <div className="gv-phone__compose">
            <span className="gv-phone__plus">
              <Plus />
            </span>
            <span className="gv-phone__field">
              Text Message
              <span className="gv-phone__send">
                <ArrowUp />
              </span>
            </span>
          </div>
          <span className="gv-phone__home" />
        </div>
      </div>
    </div>
  );
}

const HERO_STACK_FALLBACK = [
  "https://images.kharis.org/site-images/main/8527db06a4968c60/give/thanksgiving-hands-raised.jpg",
  "https://images.kharis.org/site-images/main/e686a4818115ee4e/give/thanksgiving-hall.jpg",
  "https://images.kharis.org/site-images/main/72e8b112e585bed6/give/thanksgiving-heart-hands.jpg",
] as const;

const BUILDING_FALLBACK =
  "https://images.kharis.org/site-images/main/8f521cd8c5d3a713/spurgeons-impression.jpg";

export function GiveExperience({
  branches,
  heroStack = [...HERO_STACK_FALLBACK],
  buildingPhoto = BUILDING_FALLBACK,
}: {
  branches: GivingBranch[];
  heroStack?: string[];
  buildingPhoto?: string;
}) {
  const [way, setWay] = useState<Way>("online");
  const [hasSwitched, setHasSwitched] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const deskRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState<number | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const measure = () => setPanelHeight(content.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, [way]);

  const showWay = (next: Way, focus = false) => {
    if (next !== way) setHasSwitched(true);
    setWay(next);
    if (focus) tabRefs.current[WAYS.findIndex((w) => w.id === next)]?.focus();
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const steps: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    };
    let next: number | null = null;
    if (e.key in steps) next = (index + steps[e.key]! + WAYS.length) % WAYS.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = WAYS.length - 1;
    if (next === null) return;
    e.preventDefault();
    showWay(WAYS[next]!.id, true);
  };

  return (
    <div className="gv">
      <header className="gv-hero">
        <div className="gv-hero__copy">
          <p className="gv-eyebrow">Giving at Kharis</p>
          <h1 className="gv-hero__title">
            <span className="gv-rise gv-3d" style={{ animationDelay: "120ms" }}>
              Sow
            </span>{" "}
            <span className="gv-rise gv-3d gv-yellow" style={{ animationDelay: "320ms" }}>
              bountifully.
            </span>
          </h1>
          <p className="gv-hero__verse">
            &ldquo;He who sows bountifully will also reap bountifully.&rdquo;
            <cite>2 Corinthians 9:6</cite>
          </p>
          <p className="gv-hero__lede">
            Tithes and offerings are part of our worship. Give online through your branch, by bank
            transfer or by text, wherever you are.
          </p>
          <div className="btn-pair gv-hero__ctas">
            <a href="#ways" className="btn-give">
              Give to your branch
            </a>
            <a href="#building" className="btn-secondary">
              {SPURGEONS_CENTRE.publicName}
            </a>
          </div>
        </div>

        <div className="gv-hero__stack" aria-hidden>
          <figure className="gv-hero__photo gv-hero__photo--left">
            <Image src={heroStack[0] ?? HERO_STACK_FALLBACK[0]} alt="" fill sizes="34vw" />
          </figure>
          <figure className="gv-hero__photo gv-hero__photo--right">
            <Image src={heroStack[1] ?? HERO_STACK_FALLBACK[1]} alt="" fill sizes="34vw" />
          </figure>
          <figure className="gv-hero__photo gv-hero__photo--centre">
            <Image
              src={heroStack[2] ?? HERO_STACK_FALLBACK[2]}
              alt=""
              fill
              priority
              sizes="(max-width: 767px) 86vw, 46vw"
            />
          </figure>
        </div>
      </header>

      <section id="ways" ref={deskRef} className="gv-desk" aria-labelledby="ways-title">
        <div className="gv-head">
          <p className="gv-kicker">Three ways to give</p>
          <h2 id="ways-title">Pick what suits you</h2>
        </div>

        <div className="gv-desk__body">
          <div className="gv-tabs" role="tablist" aria-label="Ways to give">
            {WAYS.map((w, i) => (
              <button
                key={w.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`way-${w.id}`}
                aria-selected={way === w.id}
                aria-controls="way-panel"
                tabIndex={way === w.id ? 0 : -1}
                className="gv-tab"
                onClick={() => showWay(w.id)}
                onKeyDown={(e) => onTabKey(e, i)}
              >
                <span className="gv-tab__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="gv-tab__text">
                  <span className="gv-tab__label">{w.label}</span>
                  <span className="gv-tab__hint">{w.hint}</span>
                </span>
              </button>
            ))}
          </div>

          <div
            id="way-panel"
            role="tabpanel"
            aria-labelledby={`way-${way}`}
            className="gv-panel"
            tabIndex={0}
          >
            <motion.div
              className="gv-panel__viewport"
              initial={false}
              animate={{ height: panelHeight ?? "auto" }}
              transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                key={way}
                ref={contentRef}
                className="gv-panel__content"
                initial={hasSwitched && !reduceMotion ? { opacity: 0, y: 12 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {way === "online" ? <OnlinePanel branches={branches} /> : null}
                {way === "bank" ? <BankPanel /> : null}
                {way === "text" ? <TextPanel /> : null}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="building" className="gv-build" aria-labelledby="building-title">
        <div className="gv-build__inner">
          <div className="gv-build__art">
            <Image
              src={buildingPhoto}
              alt="An artist's impression of the proposed renovations in South London"
              fill
              sizes="(max-width: 899px) 92vw, 44vw"
            />
          </div>
          <div className="gv-build__copy">
            <p className="gv-eyebrow">{SPURGEONS_CENTRE.publicName}</p>
            <h2 id="building-title">
              We&rsquo;ve purchased <span className="gv-yellow">our new home</span>
            </h2>
            <p>
              We are excited to announce that we have officially acquired our own facility that was
              formerly Spurgeon&rsquo;s College.
            </p>
            <p>
              Now begins the exciting work restoring and developing this facility into a home for
              advancing the gospel.
            </p>
            <p>
              If you would like to partner with us and give towards this project, you can do so
              using the link below.
            </p>
            <div className="btn-pair">
              <a
                href={SPURGEONS_CENTRE.giveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-give"
              >
                Build with us
              </a>
              <a
                href={SPURGEONS_CENTRE.pledgeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Make a pledge
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
