"use client";

import Link from "next/link";
const eaLogoLight = "/assets/ea-logo-light.png";
const eaLogoDark = "/assets/ea-logo-dark.png";

type FooterColumn = {
  title: string;
  titleColor: string;
  links: { label: string; to: string; href?: boolean }[];
};

const COLUMNS: FooterColumn[] = [
  {
    title: "About",
    titleColor: "text-primary",
    links: [
      { label: "About Us", to: "/mission" },
      { label: "Governance", to: "/governance" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
  {
    title: "Get Involved",
    titleColor: "text-on-background",
    links: [
      { label: "Become a Member", to: "/fellowships" },
      { label: "Volunteer", to: "/departments" },
      { label: "Fellowships", to: "/fellowships" },
      { label: "Departments", to: "/departments" },
    ],
  },
  {
    title: "Join Us",
    titleColor: "text-primary",
    links: [
      { label: "Find a Branch", to: "/branches" },
      { label: "Life", to: "/life" },
      { label: "Events", to: "/events" },
      { label: "Messages", to: "/messages" },
    ],
  },
  {
    title: "Finance",
    titleColor: "text-on-background",
    links: [
      { label: "Giving", to: "/giving" },
      { label: "Media", to: "/media" },
    ],
  },
];

const footerLinkClass =
  "relative inline-block hover:text-primary transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full";

export function SiteFooter() {
  return (
    <footer className="w-full relative border-t-4 border-primary bg-surface-container-highest overflow-hidden">
      <div
        className="halftone absolute inset-0 z-0 pointer-events-none opacity-[0.15]"
        aria-hidden="true"
      ></div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-gutter gap-y-10 px-margin-mobile md:px-margin-desktop py-14 max-w-7xl mx-auto relative z-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-3 lg:col-span-2 space-y-4">
          <div className="font-display-xl text-4xl md:text-5xl text-primary tracking-tighter leading-none">
            KHARIS
            <span className="text-on-background"> PHASE 2.</span>
          </div>
          <p className="font-body-md text-on-surface-variant max-w-xs">
            Changing the world with a touch of His grace.
          </p>
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
          </div>
        </div>

        {/* Link columns */}
        {COLUMNS.map((col) => (
          <div className="space-y-3" key={col.title}>
            <h4
              className={`font-headline-md text-lg uppercase mb-3 border-b-4 border-primary inline-block pb-1 ${col.titleColor}`}
            >
              {col.title}
            </h4>
            <ul className="space-y-2 font-body-md text-on-surface-variant">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <a
                      className={footerLinkClass}
                      href={link.to}
                    >
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

      <div className="relative z-10 flex flex-col items-center gap-3 px-margin-mobile md:px-margin-desktop">
        <span className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant">
          Member of
        </span>
        <div className="w-full max-w-[220px]">
          <img
            src={eaLogoLight}
            alt="Evangelical Alliance — together making Jesus known"
            className="block dark:hidden w-full h-auto"
            loading="lazy"
            decoding="async"
          />
          <img
            src={eaLogoDark}
            alt=""
            aria-hidden="true"
            className="hidden dark:block w-full h-auto"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div className="text-center mt-6 pb-8 font-body-md text-xs text-on-surface-variant px-margin-mobile md:px-margin-desktop uppercase tracking-wide">
        © 2026 Kharis Ministries | All Rights Reserved | Charity Number 1139291
      </div>

    </footer>
  );
}