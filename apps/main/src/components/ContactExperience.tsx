"use client";

import { useState } from "react";
import { ContactBranches } from "@/components/contact/ContactBranches";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactLetter } from "@/components/contact/ContactLetter";
import type { ContactLocation } from "@/lib/contact-branches";
import "./contact/contact-page.css";

/** Official channels, as linked from kharis.org and the church's Instagram bio. */
const CHANNELS = [
  {
    label: "Watch on YouTube",
    href: "https://www.youtube.com/@davidantwi",
    className: "unsure-panel__btn unsure-panel__btn--solid",
    path: "M23.5 7.2a3 3 0 0 0-2.1-2.1C19.5 4.5 12 4.5 12 4.5s-7.5 0-9.4.6A3 3 0 0 0 .5 7.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-4.8ZM9.8 15.5v-7l6.3 3.5-6.3 3.5Z",
  },
  {
    label: "Follow on Instagram",
    href: "https://www.instagram.com/kharischurch/",
    className: "unsure-panel__btn unsure-panel__btn--ghost",
    path: "M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm6.1-8.1a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0ZM12 2.2c-2.2 0-2.5 0-3.4.05a5.8 5.8 0 0 0-1.9.36 3.9 3.9 0 0 0-1.4.9 3.9 3.9 0 0 0-.9 1.4 5.8 5.8 0 0 0-.36 1.9C4.2 9.5 4.2 9.8 4.2 12s0 2.5.05 3.4c.03.7.15 1.3.36 1.9.2.55.48 1 .9 1.4.4.42.85.7 1.4.9.6.21 1.2.33 1.9.36.9.05 1.2.05 3.4.05s2.5 0 3.4-.05c.7-.03 1.3-.15 1.9-.36.55-.2 1-.48 1.4-.9.42-.4.7-.85.9-1.4.21-.6.33-1.2.36-1.9.05-.9.05-1.2.05-3.4s0-2.5-.05-3.4a5.8 5.8 0 0 0-.36-1.9 3.9 3.9 0 0 0-.9-1.4 3.9 3.9 0 0 0-1.4-.9 5.8 5.8 0 0 0-1.9-.36C14.5 2.2 14.2 2.2 12 2.2Zm0 1.6c2.2 0 2.4 0 3.3.05.63.03 1 .13 1.23.22.32.12.55.27.79.5.23.24.38.47.5.79.09.24.19.6.22 1.23.04.86.05 1.12.05 3.3s0 2.44-.05 3.3a3.7 3.7 0 0 1-.22 1.23 1.9 1.9 0 0 1-.5.79c-.24.23-.47.38-.79.5-.24.09-.6.19-1.23.22-.86.04-1.12.05-3.3.05s-2.44 0-3.3-.05a3.7 3.7 0 0 1-1.23-.22 1.9 1.9 0 0 1-.79-.5 1.9 1.9 0 0 1-.5-.79 3.7 3.7 0 0 1-.22-1.23c-.04-.86-.05-1.12-.05-3.3s0-2.44.05-3.3c.03-.63.13-1 .22-1.23.12-.32.27-.55.5-.79.24-.23.47-.38.79-.5.24-.09.6-.19 1.23-.22.86-.04 1.12-.05 3.3-.05Z",
  },
  {
    label: "Kharis on Facebook",
    href: "https://www.facebook.com/KharisMinistries",
    className: "unsure-panel__btn unsure-panel__btn--ghost",
    path: "M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.6c0-.9.3-1.6 1.6-1.6h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.6v3.2h2.5V22h3.4Z",
  },
] as const;

type Props = {
  locations: ContactLocation[];
};

export function ContactExperience({ locations }: Props) {
  const branches = locations;
  const hq = branches.find((b) => b.name === "London") ?? branches[0] ?? null;

  const [activeId, setActiveId] = useState<string | null>(hq?.id ?? null);
  const [letterBranch, setLetterBranch] = useState("");
  const [focusSignal, setFocusSignal] = useState(0);

  const writeTo = (branch: ContactLocation) => {
    setLetterBranch(branch.name);
    setActiveId(branch.id);
    document.getElementById("write")?.scrollIntoView({ block: "start" });
    setFocusSignal((n) => n + 1);
  };

  return (
    <div className="hello-page">
      <ContactHero />
      <ContactLetter
        branches={branches}
        branch={letterBranch}
        onBranchChange={(name) => {
          setLetterBranch(name);
          const match = branches.find((b) => b.name === name);
          if (match) setActiveId(match.id);
        }}
        focusSignal={focusSignal}
      />
      <ContactBranches
        branches={branches}
        activeId={activeId}
        onSelect={(b) => setActiveId(b.id)}
        onWrite={writeTo}
      />

      <section className="hello-close unsure-band" aria-labelledby="hello-close-title">
        <div className="unsure-panel hello-close__panel">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/kharis-logo.png" alt="" aria-hidden className="unsure-panel__dove" />
          <div className="unsure-panel__content">
            <p className="unsure-panel__eyebrow">Between Sundays</p>
            <h2 id="hello-close-title" className="unsure-panel__title">
              Join the revival online
            </h2>
            <p className="unsure-panel__copy">
              Pastor David&apos;s messages, live services and the latest from the Kharis family,
              wherever you are in the world.
            </p>
            <div className="hello-close__links">
              {CHANNELS.map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className={c.className}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                    <path fill="currentColor" d={c.path} />
                  </svg>
                  {c.label}
                </a>
              ))}
            </div>
            <p className="hello-close__press">
              Press and media: <a href="mailto:media@kharis.org">media@kharis.org</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
