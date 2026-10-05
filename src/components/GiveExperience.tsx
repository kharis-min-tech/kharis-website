"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Check,
  Copy,
  CreditCard,
  Heart,
  HeartHandshake,
  Landmark,
  Smartphone,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { Icon } from "@/components/Icon";
import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";
import {
  BANK,
  BANK_ACCRA,
  MOMO,
  ONLINE_BRANCHES,
  ONLINE_GIVE_URL,
  TEXT_GIVE,
} from "@/lib/giving";

const TEXT_AMOUNTS = [5, 10, 15, 20] as const;

type Flow = "online" | "monthly" | "app" | "bank";

const WHY = [
  {
    title: "Worship & Obedience",
    text: "We give because God gave first. Our offerings are a response to His grace and a step of faith.",
    Glyph: HeartHandshake,
    tone: "lilac",
    well: "purple" as const,
  },
  {
    title: "Care for People",
    text: "Generosity meets real needs in our community, from food support to mentorship and crisis relief.",
    Glyph: Heart,
    tone: "gold",
    well: "gold" as const,
  },
  {
    title: "Build Community",
    text: "Every gift helps create spaces where people can belong, grow, and discover their purpose.",
    Glyph: UsersRound,
    tone: "cream",
    well: "purple" as const,
  },
] as const;

function CopyRow({ label, value }: { label: string; value: string }) {
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
    <div className="give-copy">
      <div>
        <p className="give-copy__label">{label}</p>
        <p className="give-copy__value">{value}</p>
      </div>
      <button type="button" className="give-copy__btn" onClick={copy}>
        {copied ? (
          <Check className="h-4 w-4" aria-hidden />
        ) : (
          <Copy className="h-4 w-4" aria-hidden />
        )}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function IconWell({
  Glyph,
  tone = "purple",
  children,
}: {
  Glyph?: LucideIcon;
  tone?: "purple" | "gold" | "light";
  children?: ReactNode;
}) {
  return (
    <span className={`give-icon-well give-icon-well--${tone}`} aria-hidden>
      {Glyph ? <Glyph strokeWidth={1.55} /> : children}
    </span>
  );
}

export function GiveExperience() {
  const reduce = useReducedMotion();
  const [flow, setFlow] = useState<Flow | null>("bank");
  const [fromBuilding, setFromBuilding] = useState(false);
  const [amount, setAmount] = useState<(typeof TEXT_AMOUNTS)[number]>(10);
  const [branch, setBranch] = useState<(typeof ONLINE_BRANCHES)[number]>(
    ONLINE_BRANCHES[0]!,
  );

  const smsHref = useMemo(() => {
    const body = encodeURIComponent(`${TEXT_GIVE.keyword} ${amount}`);
    return `sms:${TEXT_GIVE.number}?&body=${body}`;
  }, [amount]);

  const onlineHref = useMemo(() => {
    const q = encodeURIComponent(branch);
    return `${ONLINE_GIVE_URL}?branch=${q}`;
  }, [branch]);

  const openFlow = (next: Flow, building = false) => {
    setFromBuilding(building);
    setFlow(next);
    window.setTimeout(() => {
      document
        .getElementById("give-flow")
        ?.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "center",
        });
    }, 120);
  };

  useEffect(() => {
    const applyHash = () => {
      if (window.location.hash !== "#building") return;
      setFromBuilding(true);
      setFlow("bank");
      window.setTimeout(() => {
        document
          .getElementById("give-flow")
          ?.scrollIntoView({
            behavior: reduce ? "auto" : "smooth",
            block: "start",
          });
      }, 60);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [reduce]);

  const panelEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div className="give-page">
      <header className="give-hero">
        <div
          className="give-hero__media"
          style={{ backgroundImage: "url(/images/build-house.jpg)" }}
        />
        <div className="give-hero__veil" />
        <div className="give-hero__dots" aria-hidden />
        <Reveal variant="blur" className="give-hero__copy">
          <p className="give-hero__badge">Impact through grace</p>
          <h1>
            <span>Your generosity</span>
            <span className="give-hero__gold">powers the mission</span>
          </h1>
          <p>
            Giving at Kharis fuels worship, discipleship, and care for people.
            Kharis Phase 2 is our students and young people&apos;s expression
            of the same mission: raising the next generation to know God and
            serve their generation.
          </p>
        </Reveal>
      </header>

      <section id="ways" className="give-methods" aria-labelledby="ways-to-give">
        <Reveal className="give-methods__intro">
          <h2 id="ways-to-give" className="give-methods__title">
            Ways to give
          </h2>
          <p>
            Choose the method that is most convenient for you. All transactions
            are securely handled.
          </p>
          <p className="give-methods__note">
            Every gift, large or small, is an act of worship. Thank you for
            partnering with Kharis as we change the world with a touch of His
            grace.
          </p>
        </Reveal>

        <RevealStagger className="give-methods__grid" stagger={0.08}>
          <RevealItem className="give-way give-way--featured" variant="up">
            <span className="give-way__badge">Recommended</span>
            <IconWell Glyph={Landmark} tone="light" />
            <h3>Bank transfer</h3>
            <p>
              Direct deposits for tithes, offerings, or structured monthly
              transfers. Clear details for the UK and Ghana.
            </p>
            <button
              type="button"
              className="give-cta give-cta--on-dark"
              onClick={() => openFlow("bank")}
            >
              View details
            </button>
          </RevealItem>

          <RevealItem className="give-way" variant="up">
            <IconWell Glyph={CreditCard} />
            <h3>Online portal</h3>
            <p>
              Choose your branch and continue to the secure Kharis giving page.
            </p>
            <label className="give-branch-select">
              <span>Branch</span>
              <select
                value={branch}
                onChange={(e) =>
                  setBranch(e.target.value as (typeof ONLINE_BRANCHES)[number])
                }
              >
                {ONLINE_BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>
            <a
              href={onlineHref}
              target="_blank"
              rel="noreferrer"
              className="give-cta"
            >
              Continue to give
            </a>
          </RevealItem>

          <RevealItem className="give-way" variant="up">
            <IconWell Glyph={Smartphone} />
            <h3>Mobile app</h3>
            <p>
              Download the Kharis Hub app. Manage recurring giving and track
              your history easily.
            </p>
            <button
              type="button"
              className="give-cta give-cta--quiet"
              onClick={() => openFlow("app")}
            >
              Get the app
            </button>
          </RevealItem>
        </RevealStagger>

        <div id="give-flow" className="give-flow">
          <span id="building" className="give-flow__anchor" aria-hidden />
          <AnimatePresence mode="wait">
            {flow ? (
              <motion.div
                key={flow}
                className="give-panel"
                initial={
                  reduce ? false : { opacity: 0, y: 24, filter: "blur(8px)" }
                }
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={
                  reduce
                    ? undefined
                    : { opacity: 0, y: -16, filter: "blur(6px)" }
                }
                transition={{ duration: 0.42, ease: panelEase }}
              >
                <div className="give-panel__top">
                  <p className="eyebrow">
                    {flow === "online" && "Online portal"}
                    {flow === "monthly" && "Monthly giving"}
                    {flow === "app" && "Kharis Hub"}
                    {flow === "bank" && "Bank transfer"}
                  </p>
                  <button
                    type="button"
                    className="give-panel__close"
                    onClick={() => setFlow(null)}
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {flow === "online" || flow === "monthly" ? (
                  <div className="give-panel__body give-panel__body--bank">
                    <div>
                      <h3>UK Bank Transfer</h3>
                      <p>
                        {flow === "monthly"
                          ? "Set up a standing order from your bank using these details."
                          : fromBuilding
                            ? "Transfer to the building fund using these bank details. Please use your name and 'Building Fund' as the reference."
                            : "Transfer your tithe or offering directly using these bank details."}
                      </p>
                      <CopyRow label="Account name" value={BANK.accountName} />
                      <CopyRow
                        label="Account number"
                        value={BANK.accountNumber}
                      />
                      <CopyRow label="Sort code" value={BANK.sortCode} />
                      <CopyRow label="IBAN" value={BANK.iban} />
                      <CopyRow label="SWIFT / BIC" value={BANK.swift} />
                    </div>
                    <div className="give-panel__text">
                      <h3>Ghana (CalBank)</h3>
                      <p>For giving from Ghana, use the CalBank details below.</p>
                      <CopyRow
                        label="Account name"
                        value={BANK_ACCRA.accountName}
                      />
                      <CopyRow
                        label="Account number"
                        value={BANK_ACCRA.accountNumber}
                      />
                      <CopyRow label="Bank" value={BANK_ACCRA.bank} />
                      <CopyRow label="SWIFT / BIC" value={BANK_ACCRA.swift} />
                    </div>
                    <div className="give-panel__text">
                      <h3>Mobile Money (MoMo)</h3>
                      <p>Give via Mobile Money in Ghana.</p>
                      <CopyRow label="Account name" value={MOMO.accountName} />
                      <CopyRow label="USSD code" value={MOMO.ussd} />
                    </div>
                  </div>
                ) : null}

                {flow === "app" ? (
                  <div className="give-panel__body give-panel__body--app">
                    <h3>Download the Kharis Hub app</h3>
                    <p>
                      Manage recurring giving and track your history from your
                      phone. Available on iPhone and Android.
                    </p>
                    <div className="give-panel__stores">
                      <a
                        href="https://kharis.org/"
                        className="vision-store vision-store--apple"
                      >
                        <span className="vision-store__icon" aria-hidden>
                          <Icon name="apple" className="h-6 w-6" />
                        </span>
                        <span className="vision-store__copy">
                          <strong>App Store</strong>
                          <span>Download for iPhone</span>
                        </span>
                      </a>
                      <a
                        href="https://kharis.org/"
                        className="vision-store vision-store--android"
                      >
                        <span className="vision-store__icon" aria-hidden>
                          <Icon name="android" className="h-6 w-6" />
                        </span>
                        <span className="vision-store__copy">
                          <strong>Google Play</strong>
                          <span>Download for Android</span>
                        </span>
                      </a>
                    </div>
                  </div>
                ) : null}

                {flow === "bank" ? (
                  <div className="give-panel__body give-panel__body--bank">
                    <div>
                      <h3>Kharis Ministries</h3>
                      <p>
                        {fromBuilding
                          ? "Transfer to the building fund using these bank details. Please use your name and 'Building Fund' as the reference."
                          : "Direct deposits for tithes, offerings, or structured monthly transfers. Use these details from your own bank."}
                      </p>
                      <CopyRow label="Account name" value={BANK.accountName} />
                      <CopyRow
                        label="Account number"
                        value={BANK.accountNumber}
                      />
                      <CopyRow label="Sort code" value={BANK.sortCode} />
                      <CopyRow label="IBAN" value={BANK.iban} />
                      <CopyRow label="SWIFT / BIC" value={BANK.swift} />
                    </div>
                    <div className="give-panel__text">
                      <h3>Ghana (CalBank)</h3>
                      <p>For giving from Ghana, use the CalBank details below.</p>
                      <CopyRow
                        label="Account name"
                        value={BANK_ACCRA.accountName}
                      />
                      <CopyRow
                        label="Account number"
                        value={BANK_ACCRA.accountNumber}
                      />
                      <CopyRow label="Bank" value={BANK_ACCRA.bank} />
                      <CopyRow label="SWIFT / BIC" value={BANK_ACCRA.swift} />
                    </div>
                    <div className="give-panel__text">
                      <h3>Or text (UK)</h3>
                      <p>
                        Text{" "}
                        <strong>
                          {TEXT_GIVE.keyword} {amount}
                        </strong>{" "}
                        to <strong>{TEXT_GIVE.number}</strong>. Maximum £
                        {TEXT_GIVE.maxPounds}.
                      </p>
                      <div
                        className="give-amounts"
                        role="group"
                        aria-label="Amount"
                      >
                        {TEXT_AMOUNTS.map((n) => (
                          <button
                            key={n}
                            type="button"
                            className={`give-amounts__chip${amount === n ? " is-on" : ""}`}
                            onClick={() => setAmount(n)}
                          >
                            £{n}
                          </button>
                        ))}
                      </div>
                      <p className="give-card__hint">
                        Added to your next bill, or taken from pay-as-you-go.
                      </p>
                      <a href={smsHref} className="give-cta give-cta--quiet">
                        Open messages
                      </a>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </section>

      <section className="give-why" aria-labelledby="why-we-give">
        <Reveal className="give-why__intro">
          <h2 id="why-we-give" className="give-why__title">
            <span className="give-why__mark">Why</span> we give
          </h2>
          <p>
            Giving is an act of worship, faith, and love. It fuels the mission,
            cares for people, and plants seeds for the next generation.
          </p>
        </Reveal>

        <RevealStagger className="give-why__grid" stagger={0.07}>
          {WHY.map((card) => (
            <RevealItem
              key={card.title}
              className={`give-why__card give-why__card--${card.tone}`}
              variant="up"
            >
              <IconWell Glyph={card.Glyph} tone={card.well} />
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </RevealItem>
          ))}
        </RevealStagger>
      </section>

      <section className="give-close" aria-labelledby="ready-to-give">
        <Reveal className="give-banner">
          <div className="give-banner__shapes" aria-hidden>
            <span className="unsure-shape unsure-shape--orb-a" />
            <span className="unsure-shape unsure-shape--orb-b" />
            <span className="unsure-shape unsure-shape--orb-c" />
            <span className="unsure-shape unsure-shape--ring" />
          </div>
          <div className="give-banner__content">
            <p className="give-banner__eyebrow">Partner with the mission</p>
            <h2 id="ready-to-give">Ready to make a difference?</h2>
            <p>
              Your gift helps Kharis preach Christ, care for people, and raise
              the next generation. Thank you for sowing into what God is doing
              among us.
            </p>
            <div className="give-banner__actions">
              <button
                type="button"
                className="unsure-panel__btn unsure-panel__btn--solid"
                onClick={() => openFlow("bank")}
              >
                Give by bank transfer
              </button>
              <button
                type="button"
                className="unsure-panel__btn unsure-panel__btn--ghost"
                onClick={() => openFlow("monthly")}
              >
                Set up monthly
              </button>
            </div>
            <p className="give-banner__foot">
              Kharis Ministries · Charity number 1139291
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
