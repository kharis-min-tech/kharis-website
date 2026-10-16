"use client";

import { AppPhonePreview } from "../../../../shared/AppPhonePreview";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { KHARIS_APP } from "@/lib/kharis-app";

const LISTEN_STEPS = [
  {
    title: "Open the app home",
    detail: "See latest audio, video and playlists.",
    screen: "home",
  },
  {
    title: "Search any message",
    detail: "Find the teaching you need in a tap.",
    screen: "messages",
  },
  {
    title: "Press play and go",
    detail: "Listen anywhere you are.",
    screen: "player",
  },
] as const;

export function VisionSection() {
  return (
    <section id="vision" className="listen-band">
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-12">
        <Reveal variant="up" distance={28} className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Get the app</p>
          <h2 className="section-title mt-2">Church in your pocket.</h2>
          <p className="mx-auto mt-4 max-w-xl text-[0.98rem] font-semibold leading-relaxed text-muted">
            Download the Kharis app, then listen to any message in three simple steps: home, search,
            and play.
          </p>

          <div className="btn-pair mt-7">
            <a
              href={KHARIS_APP.iosUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Download the app
              <Icon name="arrow" className="h-3.5 w-3.5" />
            </a>
            <a href="#messages" className="btn-secondary">
              Watch messages
            </a>
          </div>
          <p className="mt-3 text-xs font-medium text-muted">Available on iPhone &amp; Android</p>
        </Reveal>

        <Reveal variant="up" delay={0.08} className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
          {LISTEN_STEPS.map((step, i) => (
            <article key={step.title} className="listen-card">
              <div className="listen-card__copy">
                <p className="listen-card__step">Step {i + 1}</p>
                <h3 className="listen-card__title">{step.title}</h3>
                <p className="listen-card__detail">{step.detail}</p>
              </div>

              <div className="listen-phone">
                <AppPhonePreview screen={step.screen} />
              </div>
            </article>
          ))}
        </Reveal>

        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-4">
          <a
            href={KHARIS_APP.iosUrl}
            target="_blank"
            rel="noopener noreferrer"
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
            href={KHARIS_APP.androidUrl}
            target="_blank"
            rel="noopener noreferrer"
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
    </section>
  );
}
