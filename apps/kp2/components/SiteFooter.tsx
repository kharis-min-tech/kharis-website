"use client";

import Link from "next/link";
import { FooterWorld } from "@/components/FooterWorld";
import { TikTokIcon } from "@/components/TikTokIcon";
import { TIKTOK_URL } from "@/lib/social";
const eaLogoLight = "https://images.kharis.org/site-images/kp2/7034e8bd749d082a/ea-logo-light.png";
const eaLogoDark = "https://images.kharis.org/site-images/kp2/8d53006577293048/ea-logo-dark.png";

const KHARIS_MAIN_URL = "https://kharis.org/";

type FooterColumn = {
  title: string;
  titleColor: string;
  links: { label: string; to: string; external?: boolean }[];
};

const COLUMNS: FooterColumn[] = [
  {
    title: "About",
    titleColor: "text-primary",
    links: [
      { label: "Mission", to: "/mission" },
      { label: "Kharis Church", to: KHARIS_MAIN_URL, external: true },
      { label: "Governance", to: "/governance" },
    ],
  },
  {
    title: "Get Involved",
    titleColor: "text-on-background",
    links: [
      { label: "Serve at Kharis", to: "/quiz" },
      { label: "Find a Location", to: "/branches" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Finance",
    titleColor: "text-on-background",
    links: [
      { label: "Giving", to: "/giving" },
      { label: "Building Fund", to: "/giving#building" },
    ],
  },
];

const footerLinkClass = "hover:text-primary transition-colors";

export function SiteFooter() {
  return (
    <footer className="w-full relative border-t-4 border-primary bg-surface-container-highest overflow-hidden">
      <div
        className="halftone absolute inset-0 z-0 pointer-events-none opacity-[0.15]"
        aria-hidden="true"
      ></div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-gutter gap-y-10 px-margin-mobile md:px-margin-desktop py-14 max-w-7xl mx-auto relative z-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-3 lg:col-span-2 space-y-4">
          <div className="font-display-xl text-4xl md:text-5xl text-primary tracking-tighter leading-none">
            KHARIS
            <span className="text-on-background"> PHASE 2.</span>
          </div>
          <div className="flex gap-3 pt-2">
            <a
              className="w-11 h-11 bg-background comic-border flex items-center justify-center text-on-background brutalist-shadow hover:-translate-y-1 transition-transform"
              href="https://youtube.com/@davidantwi"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              <span className="material-symbols-outlined">play_arrow</span>
            </a>
            <a
              className="w-11 h-11 bg-background comic-border flex items-center justify-center text-on-background brutalist-shadow hover:-translate-y-1 transition-transform"
              href="https://instagram.com/kharisphasetwo"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <span className="material-symbols-outlined">photo_camera</span>
            </a>
            <a
              className="w-11 h-11 bg-background comic-border flex items-center justify-center text-on-background brutalist-shadow hover:-translate-y-1 transition-transform"
              href={TIKTOK_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
            >
              <TikTokIcon className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Link columns */}
        {COLUMNS.map((col) => (
          <div className="space-y-3" key={col.title}>
            <h4 className={`font-headline-md text-lg uppercase mb-3 ${col.titleColor}`}>
              {col.title}
            </h4>
            <ul className="space-y-2 font-body-md text-on-surface-variant">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a className={footerLinkClass} href={link.to}>
                      {link.label}
                    </a>
                  ) : (
                    <Link className={footerLinkClass} href={link.to}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <FooterWorld />

      <div className="relative z-10 mt-8 border-t-4 border-[#151218] bg-[#151218] text-[#fffdf5]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center justify-items-center gap-4 px-margin-mobile py-5 text-center xl:grid-cols-[minmax(0,1fr)_auto_auto] xl:justify-items-stretch xl:text-left md:px-margin-desktop">
          <p className="font-body-md text-xs uppercase tracking-wide xl:text-left">
            © 2026 Kharis Ministries
            <span className="mx-2 text-[#f7be1d]" aria-hidden="true">
              |
            </span>
            All rights reserved
            <span className="mx-2 text-[#f7be1d]" aria-hidden="true">
              |
            </span>
            Charity number 1139291
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 xl:justify-self-center">
            <Link
              href="/cookies"
              className="no-accent-fill inline-flex border-[3px] border-[#fffdf5] bg-[#ffde59] px-3 py-1 font-headline-md text-sm uppercase tracking-wide text-[#151218] shadow-[3px_3px_0_#fffdf5] transition-transform hover:-translate-y-0.5"
            >
              Cookie Policy
            </Link>
            <Link
              href="/governance#disclaimer"
              className="no-accent-fill inline-flex -rotate-2 border-[3px] border-[#151218] bg-[#f7be1d] px-3 py-1 font-headline-md text-sm uppercase tracking-wide text-[#151218] shadow-[3px_3px_0_#f7be1d] transition-transform hover:-translate-y-0.5 hover:rotate-0"
            >
              Disclaimer
            </Link>
            <Link
              href="/governance#privacy"
              className="no-accent-fill inline-flex rotate-1 border-[3px] border-[#fffdf5] bg-[#630ed4] px-3 py-1 font-headline-md text-sm uppercase tracking-wide text-white shadow-[3px_3px_0_#fffdf5] transition-transform hover:-translate-y-0.5 hover:rotate-0"
            >
              Privacy Policy
            </Link>
          </div>
          <img
            src={eaLogoLight}
            alt="Evangelical Alliance — together making Jesus known"
            className="block h-auto w-[min(78vw,300px)] dark:hidden xl:justify-self-end"
            loading="lazy"
            decoding="async"
          />
          <img
            src={eaLogoDark}
            alt=""
            aria-hidden="true"
            className="hidden h-auto w-[min(78vw,300px)] dark:block xl:justify-self-end"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </footer>
  );
}
