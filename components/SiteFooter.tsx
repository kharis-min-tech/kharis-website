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
      { label: "Testimony Form", to: "/#share-testimony" },
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
  "rounded-lg px-1 py-0.5 hover:text-primary transition-colors";

export function SiteFooter() {
  return (
    <footer className="relative bg-background px-4 pb-6 pt-8 md:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-on-background/10 bg-surface-container-lowest">
        <div className="vibe-mesh pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-cobalt/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-magenta/15 blur-3xl"
        />

        <div className="relative z-10 grid grid-cols-2 gap-x-6 gap-y-10 px-6 py-12 md:grid-cols-3 md:px-10 lg:grid-cols-6 lg:px-12 lg:py-14">
          <div className="col-span-2 space-y-4 md:col-span-3 lg:col-span-2">
            <div className="font-display-xl text-4xl leading-none tracking-tighter text-primary md:text-5xl">
              KHARIS
              <span className="text-on-background"> PHASE 2.</span>
            </div>
            <p className="max-w-xs font-body-md text-on-surface-variant">
              Changing the world with a touch of His grace.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                className="flex h-11 w-11 items-center justify-center rounded-full border border-on-background/10 bg-surface text-on-background vibe-glow"
                href="https://youtube.com/@davidantwi"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <span className="material-symbols-outlined">play_arrow</span>
              </a>
              <a
                className="flex h-11 w-11 items-center justify-center rounded-full border border-on-background/10 bg-surface text-on-background vibe-glow"
                href="https://instagram.com/kharisphasetwo"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <span className="material-symbols-outlined">photo_camera</span>
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div className="space-y-3" key={col.title}>
              <h4 className={`mb-3 font-headline-md text-lg uppercase ${col.titleColor}`}>
                {col.title}
              </h4>
              <ul className="space-y-2 font-body-md text-on-surface-variant">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
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

        <div className="relative z-10 mx-6 mb-6 flex flex-col items-center gap-4 rounded-3xl border border-on-background/10 bg-surface-container/80 px-6 py-6 backdrop-blur-md md:mx-10 lg:mx-12">
          <span className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant">
            Member of
          </span>
          <div className="w-full max-w-[220px]">
            <img
              src={eaLogoLight}
              alt="Evangelical Alliance — together making Jesus known"
              className="block h-auto w-full dark:hidden"
              loading="lazy"
              decoding="async"
            />
            <img
              src={eaLogoDark}
              alt=""
              aria-hidden="true"
              className="hidden h-auto w-full dark:block"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="text-center font-body-md text-xs uppercase tracking-wide text-on-surface-variant">
            © 2026 Kharis Ministries | All Rights Reserved | Charity Number 1139291
          </p>
        </div>
      </div>
    </footer>
  );
}
