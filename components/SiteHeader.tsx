"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavItem = {
  label: string;
  to: string;
  children?: { label: string; to: string; blurb: string }[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "HOME", to: "/" },
  {
    label: "ABOUT",
    to: "/mission",
    children: [
      { label: "MISSION", to: "/mission", blurb: "Our vision & mandate" },
      { label: "GOVERNANCE", to: "/governance", blurb: "Policies & safeguarding" },
    ],
  },
  {
    label: "COMMUNITY",
    to: "/life",
    children: [
      { label: "LIFE", to: "/life", blurb: "Groups & campus life" },
      { label: "FELLOWSHIPS", to: "/fellowships", blurb: "Find your fellowship" },
    ],
  },
  { label: "EVENTS", to: "/events" },
  {
    label: "WATCH",
    to: "/messages",
    children: [
      { label: "MESSAGES", to: "/messages", blurb: "Recent sermons" },
      { label: "SOCIAL MEDIA", to: "/media", blurb: "Photos & gallery" },
    ],
  },
  { label: "GIVE", to: "/giving" },
  { label: "CONTACT", to: "/contact" },
];

const linkBase =
  "relative font-body-md text-[13px] font-bold uppercase tracking-wide text-on-background transition-colors duration-200";

const KP2_LOGO = "/assets/kp2-logo-new.png";

export function SiteHeader() {
  const pathname = usePathname();
  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const showMenu = (label: string) => {
    cancelClose();
    setOpenMenu(label);
  };

  const hideMenu = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 160);
  };

  useEffect(() => {
    return () => cancelClose();
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-[200] overflow-visible">
      <input id="site-nav-toggle" type="checkbox" className="sr-only" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[72px] border-b border-on-background/10 bg-surface-container-lowest/90 backdrop-blur-xl"
      />

      <div className="relative mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8 overflow-visible">
        <div className="flex items-center justify-between gap-4 min-h-[72px] overflow-visible">
          <a href="/" className="shrink-0 flex items-center group">
            <img
              src={KP2_LOGO}
              alt="KP2 Kharis Phase 2"
              className="site-logo h-11 w-auto transition-transform duration-200 group-hover:-translate-y-0.5"
            />
          </a>

          <nav className="hidden xl:flex items-stretch gap-7 self-stretch overflow-visible">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className={`nav-item ${openMenu === item.label ? "is-open" : ""}`}
                  onMouseEnter={() => showMenu(item.label)}
                  onMouseLeave={hideMenu}
                  onFocusCapture={() => showMenu(item.label)}
                  onBlurCapture={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                      hideMenu();
                    }
                  }}
                >
                  <Link
                    href={item.to}
                    className={`${linkBase} flex items-center gap-1 ${openMenu === item.label || isActive(item.to) ? "text-primary" : ""}`}
                    aria-expanded={openMenu === item.label}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <span className="material-symbols-outlined text-[16px] leading-none">
                      expand_more
                    </span>
                  </Link>
                  <div className="nav-dropdown">
                    <div className="nav-dropdown-panel">
                      {item.children.map((child) => (
                        <Link
                          key={child.to}
                          href={child.to}
                          onClick={() => setOpenMenu(null)}
                        >
                          <span className="block font-body-md text-[13px] font-bold uppercase tracking-wide text-on-background">
                            {child.label}
                          </span>
                          <span className="block font-body-md text-[12px] text-on-surface-variant">
                            {child.blurb}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.to}
                  href={item.to}
                  className={`${linkBase} flex items-center ${isActive(item.to) ? "text-primary" : ""}`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden xl:block shrink-0">
            <Link
              href="/branches"
              className="group inline-flex items-center gap-2 justify-center rounded-2xl bg-amber text-[#1a0b00] font-body-md text-[13px] font-bold uppercase tracking-wide px-6 py-3 vibe-glow transition-all duration-200 hover:brightness-110"
            >
              <span className="material-symbols-outlined text-[18px] leading-none transition-transform duration-200 group-hover:scale-110">
                location_on
              </span>
              Find a Branch
            </Link>
          </div>

          <label
            htmlFor="site-nav-toggle"
            className="xl:hidden relative z-10 cursor-pointer text-on-background transition-colors duration-200 hover:text-primary"
            aria-label="Toggle navigation"
          >
            <span className="material-symbols-outlined text-[32px] nav-icon-menu">menu</span>
            <span className="material-symbols-outlined text-[32px] nav-icon-close">close</span>
          </label>
        </div>
      </div>

      <div className="mobile-nav xl:hidden relative grid overflow-hidden grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]">
        <div className="min-h-0 overflow-hidden">
          <div className="mobile-nav-inner border-t border-on-background/10 bg-surface-container-lowest px-4 md:px-6 py-6 flex flex-col gap-1 max-h-[calc(100svh-74px)] overflow-y-auto">
            {NAV_ITEMS.flatMap((item) =>
              item.children
                ? [
                    <p
                      key={item.label}
                      className="font-body-md text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant pt-4 pb-1"
                    >
                      {item.label}
                    </p>,
                    ...item.children.map((child) => (
                      <a
                        key={child.to}
                        href={child.to}
                        className="py-3 px-3 font-body-md text-sm font-bold uppercase tracking-wide text-on-background"
                      >
                        {child.label}
                      </a>
                    )),
                  ]
                : [
                    <a
                      key={item.to}
                      href={item.to}
                      className="py-3 px-3 font-body-md text-sm font-bold uppercase tracking-wide text-on-background"
                    >
                      {item.label}
                    </a>,
                  ],
            )}
            <a
              href="/branches"
              className="mt-4 rounded-2xl bg-amber text-[#1a0b00] font-body-md text-sm font-bold uppercase tracking-wide px-6 py-4 text-center vibe-glow"
            >
              Find a Branch
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
