"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BatteryFull,
  Check,
  ChevronLeft,
  Copy,
  Phone,
  Plus,
  SignalHigh,
  UserRound,
  Wifi,
} from "lucide-react";
import { BANK, BANK_ACCRA, MOMO, TEXT_GIVE, type GivingBranch } from "@/lib/giving";
import { SPURGEONS_CENTRE } from "@/lib/spurgeons";
import "./give.css";

const TEXT_AMOUNTS = [5, 10, 15, 20] as const;
const BRANCH_KEY = "kharis-give-branch";

const WAYS = [
  { id: "online", label: "Online", hint: "By card, through your branch" },
  { id: "bank", label: "Bank transfer", hint: "One-off or monthly, from the UK" },
  { id: "text", label: "Text", hint: `UK mobiles, up to £${TEXT_GIVE.maxPounds}` },
  { id: "ghana", label: "From Ghana", hint: "CalBank and Mobile Money" },
] as const;

type Way = (typeof WAYS)[number]["id"];

/** Short name for the give button: "Kharis Church London" reads as "London". */
function shortName(branch: GivingBranch) {
  return branch.name.replace(/^Kharis Church /, "").replace(/^Kharis Phase 2 /, "KP2 ");
}

function CopyRow({ label, value, hint }: { label: string; value: string; hint?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="gv-row">
      <dt>{label}</dt>
      <dd>
        {value}
        {hint ? <span className="gv-row__hint">{hint}</span> : null}
      </dd>
      <button
        type="button"
        className={`gv-row__copy${copied ? " is-done" : ""}`}
        onClick={copy}
        aria-label={copied ? `${label} copied` : `Copy ${label.toLowerCase()}`}
      >
        {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
        <span aria-hidden>{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}

function OnlinePanel({ branches, onGhana }: { branches: GivingBranch[]; onGhana: () => void }) {
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
        Pick your branch and you&apos;ll go straight to its secure giving page on Tithe.ly, where
        you can give by card once or every month.
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
          <>
            <button type="button" className="btn-give" onClick={onGhana}>
              Show the Ghana details
              <ArrowRight aria-hidden className="h-4 w-4" />
            </button>
            <p className="gv-panel__note">Accra gives by CalBank transfer or Mobile Money.</p>
          </>
        ) : (
          <a
            href={SPURGEONS_CENTRE.giveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-give"
          >
            Give to Spurgeon&apos;s Centre
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

function GhanaPanel() {
  return (
    <>
      <h3>Giving from Ghana</h3>
      <p className="gv-panel__lede">
        Kharis Accra gives through CalBank or Mobile Money. Both go to the church in Ghana.
      </p>
      <div className="gv-split">
        <div>
          <p className="gv-split__label">CalBank transfer</p>
          <dl className="gv-rows">
            <CopyRow label="Account name" value={BANK_ACCRA.accountName} />
            <CopyRow label="Account number" value={BANK_ACCRA.accountNumber} />
            <CopyRow label="Bank" value={BANK_ACCRA.bank} />
            <CopyRow
              label="SWIFT / BIC"
              value={BANK_ACCRA.swift}
              hint={`or ${BANK_ACCRA.swiftLong} if your bank asks for 11 characters`}
            />
          </dl>
        </div>
        <div>
          <p className="gv-split__label">Mobile Money</p>
          <dl className="gv-rows">
            <CopyRow label="Account name" value={MOMO.accountName} />
            <CopyRow label="USSD code" value={MOMO.ussd} />
          </dl>
          <a href={`tel:${MOMO.ussd.replace(/#/g, "%23")}`} className="gv-dial">
            <Phone aria-hidden />
            Dial {MOMO.ussd}
          </a>
        </div>
      </div>
    </>
  );
}

export function GiveExperience({ branches }: { branches: GivingBranch[] }) {
  const [way, setWay] = useState<Way>("online");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const deskRef = useRef<HTMLElement>(null);

  const showWay = (next: Way, focus = false) => {
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

  const showGhana = () => {
    showWay("ghana");
    deskRef.current?.scrollIntoView({ block: "start" });
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
              Build Spurgeon&apos;s Centre
            </a>
          </div>
        </div>

        <div className="gv-hero__stack" aria-hidden>
          <figure className="gv-hero__photo gv-hero__photo--left">
            <Image src="/images/give/thanksgiving-hands-raised.jpg" alt="" fill sizes="34vw" />
          </figure>
          <figure className="gv-hero__photo gv-hero__photo--right">
            <Image src="/images/give/thanksgiving-hall.jpg" alt="" fill sizes="34vw" />
          </figure>
          <figure className="gv-hero__photo gv-hero__photo--centre">
            <Image
              src="/images/give/thanksgiving-heart-hands.jpg"
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
          <p className="gv-kicker">Four ways to give</p>
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
            {way === "online" ? <OnlinePanel branches={branches} onGhana={showGhana} /> : null}
            {way === "bank" ? <BankPanel /> : null}
            {way === "text" ? <TextPanel /> : null}
            {way === "ghana" ? <GhanaPanel /> : null}
          </div>
        </div>
      </section>

      <section id="building" className="gv-build" aria-labelledby="building-title">
        <div className="gv-build__inner">
          <div className="gv-build__art">
            <Image
              src="/images/spurgeons-impression.jpg"
              alt="An artist's impression of the renovated Spurgeon's Centre in South London"
              fill
              sizes="(max-width: 899px) 92vw, 44vw"
            />
          </div>
          <div className="gv-build__copy">
            <p className="gv-eyebrow">Building fund</p>
            <h2 id="building-title">
              Spurgeon&apos;s <span className="gv-yellow">Centre</span>
            </h2>
            <p>
              Kharis Church has purchased Spurgeon&apos;s College in South London. We are renovating
              it to keep training missionaries and sending them into the world, and to strengthen
              the church in the UK.
            </p>
            <div className="btn-pair">
              <a
                href={SPURGEONS_CENTRE.giveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-give"
              >
                Give to the building
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
            <a
              href={SPURGEONS_CENTRE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="gv-build__more"
            >
              See the project at spurgeonscentre.org
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
