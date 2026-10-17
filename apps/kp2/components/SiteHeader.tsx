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
    to: "/departments",
    children: [
      { label: "DEPARTMENTS", to: "/departments", blurb: "Find a place to serve" },
      { label: "LIFE", to: "/life", blurb: "Groups & branch life" },
      { label: "FELLOWSHIPS", to: "/fellowships", blurb: "Find your fellowship" },
      { label: "GALLERY", to: "/gallery", blurb: "Moments from the house" },
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
  "kp-nav-link relative font-body-md text-[13px] font-bold uppercase tracking-wide text-on-background transition-colors duration-200";

const KP2_LOGO = "https://images.kharis.org/site-images/kp2/2d0d7fb8b146df33/kp2-logo-new.png";

export function SiteHeader() {
  const pathname = usePathname();
  const pathActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/");
  const isActive = (item: NavItem | string) => {
    if (typeof item === "string") return pathActive(item);
    if (item.children?.some((child) => pathActive(child.to))) return true;
    return pathActive(item.to);
  };
  useEffect(() => {
    document.documentElement.dataset.kpPageReady = pathname;
    window.dispatchEvent(new Event("kp:page-ready"));
    return () => {
      if (document.documentElement.dataset.kpPageReady === pathname) {
        delete document.documentElement.dataset.kpPageReady;
      }
    };
  }, [pathname]);

  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  const closeMobile = () => {
    setOpen(false);
    if (open) toggleRef.current?.focus();
  };

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", onResize);
    return () => desktop.removeEventListener("change", onResize);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === "Tab") {
        const links = mobileRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]");
        const last = links?.[links.length - 1];
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          toggleRef.current?.focus();
        } else if (event.shiftKey && document.activeElement === toggleRef.current) {
          event.preventDefault();
          last?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header className="site-header fixed top-0 left-0 w-full z-50 bg-surface-container-lowest border-b-2 border-on-background before:pointer-events-none before:absolute before:inset-x-0 before:top-full before:-mt-px before:h-[5px] before:bg-primary before:content-['']">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-[72px]">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMobile}
            className="kp-header-logo shrink-0 flex items-center group"
          >
            <img
              src={KP2_LOGO}
              alt="KP2 Kharis Phase 2"
              width={600}
              height={600}
              className="site-logo kp-header-logo-image"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-7">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(item.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                  onFocus={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setOpenMenu(item.label);
                  }}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setOpenMenu(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      event.stopPropagation();
                      setOpenMenu(null);
                      event.currentTarget.querySelector("a")?.focus();
                    }
                  }}
                >
                  <Link
                    href={item.to}
                    aria-current={pathname === item.to ? "page" : undefined}
                    aria-expanded={openMenu === item.label}
                    aria-controls={`nav-${item.label.toLowerCase()}`}
                    data-active={openMenu === item.label || isActive(item)}
                    className={`${linkBase} flex items-center gap-1 ${openMenu === item.label || isActive(item) ? "text-primary" : ""}`}
                  >
                    <span className="kp-nav-label">{item.label}</span>
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[16px] leading-none"
                    >
                      expand_more
                    </span>
                  </Link>
                  <div
                    id={`nav-${item.label.toLowerCase()}`}
                    inert={openMenu !== item.label}
                    className={`absolute left-0 top-full pt-4 origin-top transition-all duration-300 ease-out ${
                      openMenu === item.label
                        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                        : "opacity-0 -translate-y-2 scale-[0.98] pointer-events-none"
                    }`}
                  >
                    <div className="nav-dropdown w-64 bg-surface-container-lowest border-2 border-on-background p-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.to}
                          href={child.to}
                          aria-current={pathname === child.to ? "page" : undefined}
                          onClick={() => setOpenMenu(null)}
                          className="block px-4 py-3 transition-colors duration-150 group/item"
                        >
                          <span className="relative inline-block font-body-md text-[13px] font-bold uppercase tracking-wide after:absolute after:left-0 after:-bottom-1 after:h-[3px] after:w-0 after:bg-primary after:transition-all after:duration-200 group-hover/item:after:w-full">
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
                  aria-current={pathname === item.to ? "page" : undefined}
                  data-active={isActive(item)}
                  className={`${linkBase} ${isActive(item) ? "text-primary" : ""}`}
                >
                  <span className="kp-nav-label">{item.label}</span>
                </Link>
              ),
            )}
          </nav>

          {/* CTA */}
          <div className="hidden xl:block shrink-0">
            <Link
              href="/branches"
              className="kp-depth-button kp-button-purple header-branch-cta group inline-flex items-center gap-2 justify-center bg-primary !text-on-primary font-body-md text-[13px] font-bold uppercase tracking-wide px-6 py-3 brutalist-border brutalist-shadow transition-all duration-200 hover:bg-primary-container"
            >
              <span className="material-symbols-outlined text-[18px] leading-none transition-transform duration-200 group-hover:scale-110">
                location_on
              </span>
              Find a Branch
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            ref={toggleRef}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-controls="mobile-navigation"
            aria-expanded={open}
            className="xl:hidden min-h-11 min-w-11 flex items-center justify-center text-on-background transition-colors duration-200 hover:text-primary"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="material-symbols-outlined text-[32px]">{open ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-navigation"
        ref={mobileRef}
        inert={!open}
        className={`xl:hidden grid overflow-hidden transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`border-t-2 border-on-background bg-surface-container-lowest px-4 md:px-6 py-6 flex flex-col gap-1 max-h-[calc(100svh-74px)] overflow-y-auto transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "translate-y-0" : "-translate-y-3"}`}
          >
            {NAV_ITEMS.flatMap((item) =>
              item.children
                ? [
                    <Link
                      key={item.label}
                      href={item.to}
                      onClick={closeMobile}
                      className="font-body-md text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant pt-4 pb-1 transition-colors duration-150 hover:text-primary"
                    >
                      {item.label}
                    </Link>,
                    ...item.children.map((child) => (
                      <Link
                        key={child.to}
                        href={child.to}
                        aria-current={pathname === child.to ? "page" : undefined}
                        onClick={closeMobile}
                        className="py-3 px-3 font-body-md text-sm font-bold uppercase tracking-wide text-on-background transition-colors duration-150 relative after:absolute after:left-0 after:-bottom-1 after:h-[3px] after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full"
                      >
                        {child.label}
                      </Link>
                    )),
                  ]
                : [
                    <Link
                      key={item.to}
                      href={item.to}
                      aria-current={pathname === item.to ? "page" : undefined}
                      onClick={closeMobile}
                      className="py-3 px-3 font-body-md text-sm font-bold uppercase tracking-wide text-on-background transition-colors duration-150 relative after:absolute after:left-0 after:-bottom-1 after:h-[3px] after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full"
                    >
                      {item.label}
                    </Link>,
                  ],
            )}
            <Link
              href="/branches"
              onClick={closeMobile}
              className="kp-depth-button kp-button-purple header-branch-cta mt-4 bg-primary !text-on-primary font-body-md text-sm font-bold uppercase tracking-wide px-6 py-4 brutalist-border brutalist-shadow text-center transition-colors duration-200 hover:bg-primary-container"
            >
              Find a Branch
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
