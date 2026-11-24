"use client";

import Image from "@/components/SiteImage";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { KHARIS_APP } from "@/lib/kharis-app";
import siteImageUrls from "@/lib/site-image-urls.json";

const APP_STILLS = [
  {
    label: "Home",
    screenBackground: "#171718",
    src: siteImageUrls["/images/app-steps/kharis-app-current-home.png"],
    alt: "Kharis Church app home screen with branch updates, the daily Bible reading and Moments",
  },
  {
    label: "Media Player",
    screenBackground: "#f5f5f3",
    src: siteImageUrls["/images/app-steps/kharis-app-current-player.png"],
    alt: "Kharis Church app Media Player with audio and video tabs and playback controls",
  },
  {
    label: "Bible",
    screenBackground: "#f5f5f3",
    src: siteImageUrls["/images/app-steps/kharis-app-current-chapter.png"],
    alt: "John 3 open in the Kharis Church app Bible reader",
  },
] as const;

export function VisionSection({
  id = "vision",
  stills,
}: {
  id?: string;
  stills?: Array<{ label: string; screenBackground: string; src: string; alt: string }>;
}) {
  const screens = stills ?? APP_STILLS;
  return (
    <section id={id} className="listen-band section section--lg band band--1">
      <div className="section__inner relative z-10">
        <Reveal variant="up" distance={28} className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Stay plugged in</p>
          <h2 className="section-title mt-2">Messages on the go.</h2>
          <p className="mx-auto mt-4 max-w-xl text-[0.98rem] font-semibold leading-relaxed text-muted">
            Romans 10:17. Faith comes by hearing, and hearing by the word of God.
          </p>
        </Reveal>

        <Reveal variant="up" delay={0.08} className="mx-auto mt-10 max-w-5xl md:mt-14">
          <ul
            aria-label="Kharis app screenshots"
            tabIndex={0}
            className="grid snap-x snap-mandatory auto-cols-[min(76%,16rem)] grid-flow-col items-start gap-6 overflow-x-auto px-2 pb-4 focus-visible:outline-2 focus-visible:outline-offset-2 md:snap-none md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:gap-12 md:overflow-visible md:px-0 md:pb-0 lg:gap-20"
          >
            {screens.map((still) => (
              <li key={still.label} className="min-w-0 snap-center">
                <figure className="mx-auto max-w-[16rem]">
                  <div className="rounded-[2.25rem] border border-[#46414d] bg-[#141218] p-[clamp(0.65rem,1.35vw,0.95rem)] shadow-md">
                    <div
                      className="overflow-hidden rounded-[1.45rem] pt-[clamp(0.875rem,1.8vw,1.375rem)]"
                      style={{ backgroundColor: still.screenBackground }}
                    >
                      <Image
                        src={still.src}
                        alt={still.alt}
                        width={780}
                        height={1688}
                        quality={90}
                        sizes="(max-width: 767px) 68vw, 230px"
                        className="block h-auto w-full"
                      />
                    </div>
                  </div>
                  <figcaption className="mt-3 text-center text-sm font-semibold text-muted">
                    {still.label}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="relative z-10 mt-9 flex flex-wrap items-center justify-center gap-3 md:gap-4">
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
