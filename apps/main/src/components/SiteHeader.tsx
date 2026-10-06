"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { Icon } from "@/components/Icon";
import { getSiteTheme, subscribeSiteTheme } from "@/lib/theme";

const aboutChildren = [
  { label: "About Us", href: "/about" },
  { label: "Governance", href: "/governance" },
] as const;

type NavLink = {
  label: string;
  href?: string;
  children?: readonly { label: string; href: string }[];
};

const links: NavLink[] = [
  { label: "About", href: "/about", children: aboutChildren },
  { label: "Locations", href: "/locations" },
  { label: "KP2" },
  { label: "Events", href: "/events" },
  { label: "Messages", href: "/messages" },
  { label: "Life", href: "/life" },
  { label: "Give", href: "/give" },
  { label: "Contact", href: "/contact" },
];

type Props = {
  tone?: "auto" | "dark" | "light";
};

export function SiteHeader({ tone = "auto" }: Props) {
  const pathname = usePathname();
  const siteTheme = useSyncExternalStore(
    subscribeSiteTheme,
    getSiteTheme,
    () => "light" as const,
  );
  const siteDark = siteTheme === "dark";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const forceDark = siteDark || tone === "dark";
  const forceLight =
    !siteDark &&
    (tone === "light" ||
      pathname === "/governance" ||
      pathname.startsWith("/about/") ||
      pathname.startsWith("/life"));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setAboutOpen(false);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!aboutOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!aboutRef.current?.contains(e.target as Node)) setAboutOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [aboutOpen]);

  const onDark = siteDark
    ? true
    : forceLight
      ? false
      : forceDark
        ? !open
        : !scrolled && !open;
  const solid = siteDark
    ? true
    : forceLight
      ? true
      : forceDark
        ? scrolled || open
        : scrolled || open;

  const linkTone = (active: boolean) =>
    `text-[13px] font-semibold tracking-wide transition ${
      onDark || (forceDark && !open)
        ? active
          ? "text-white"
          : "text-white/90 hover:text-white"
        : active
          ? "text-purple"
          : "text-fg-soft hover:text-purple"
    }`;

  const aboutActive =
    pathname === "/about" ||
    pathname.startsWith("/about/") ||
    pathname === "/governance";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-400 ${
        solid
          ? forceDark
            ? "border-b border-white/10 bg-[#0a0612]/90 shadow-sm backdrop-blur-xl"
            : "border-b border-line bg-white/92 shadow-sm backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <Link href="/" aria-label="Kharis home" className="relative z-10">
          <BrandLogo
            tone={onDark || (forceDark && !open) ? "onDark" : "onLight"}
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => {
            if (link.children) {
              return (
                <div
                  key={link.label}
                  className="relative"
                  ref={aboutRef}
                  onMouseEnter={() => setAboutOpen(true)}
                  onMouseLeave={() => setAboutOpen(false)}
                >
                  <button
                    type="button"
                    className={`${linkTone(aboutActive)} inline-flex items-center gap-1`}
                    aria-expanded={aboutOpen}
                    aria-haspopup="true"
                    onClick={() => setAboutOpen((v) => !v)}
                  >
                    {link.label}
                    <span className="text-[10px] opacity-70" aria-hidden>
                      ▾
                    </span>
                  </button>
                  {aboutOpen && (
                    <div
                      className={`absolute left-1/2 top-full z-50 min-w-[13.5rem] -translate-x-1/2 pt-3`}
                    >
                      <div
                        className={`overflow-hidden rounded-xl border py-2 shadow-lg ${
                          onDark || forceDark
                            ? "border-white/10 bg-[#120816]/96 text-white backdrop-blur-xl"
                            : "border-line bg-white text-fg"
                        }`}
                      >
                        {link.children.map((child) => {
                          const active = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block px-4 py-2.5 text-[13px] font-semibold transition ${
                                onDark || forceDark
                                  ? active
                                    ? "bg-white/10 text-white"
                                    : "text-white/85 hover:bg-white/8 hover:text-white"
                                  : active
                                    ? "bg-[var(--bg-purple)] text-purple"
                                    : "text-fg-soft hover:bg-[var(--bg-purple)] hover:text-purple"
                              }`}
                              onClick={() => setAboutOpen(false)}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            const active =
              link.href === pathname ||
              (link.href === "/give" && pathname === "/give") ||
              (link.href === "/life" && pathname.startsWith("/life"));
            const className = linkTone(Boolean(active));
            if (!link.href) {
              return (
                <span key={link.label} className={`${className} cursor-default`}>
                  {link.label}
                </span>
              );
            }
            if (link.href.startsWith("http")) {
              return (
                <a key={link.label} href={link.href} className={className}>
                  {link.label}
                </a>
              );
            }
            return (
              <Link key={link.label} href={link.href} className={className}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/locations"
            className={`hidden items-center gap-2 rounded-full px-5 py-2.5 text-[0.8rem] font-extrabold transition sm:inline-flex ${
              siteDark
                ? "bg-orange text-[#1c1c1f] hover:bg-[#f2b254]"
                : onDark || (forceDark && !open)
                  ? "bg-white text-fg hover:bg-white/95"
                  : "btn-primary !px-5 !py-2.5 !text-[0.8rem]"
            }`}
          >
            Find a Branch
            {(onDark || (forceDark && !open)) && (
              <span className="grid h-6 w-6 place-items-center rounded-full bg-orange text-white">
                <Icon name="arrow" className="h-3 w-3" />
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label="Menu"
            className={`grid h-10 w-10 place-items-center rounded-full border lg:hidden ${
              onDark || (forceDark && !open)
                ? "border-white/35 text-white"
                : "border-line text-fg"
            }`}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "×" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div
          className={`border-t px-5 py-4 lg:hidden ${
            forceDark
              ? "border-white/10 bg-[#0a0612] text-white"
              : "border-line bg-white"
          }`}
        >
          {links.map((link) => {
            if (link.children) {
              return (
                <div key={link.label} className="py-2">
                  <p
                    className={`mb-1 text-xs font-bold uppercase tracking-[0.14em] ${
                      forceDark ? "text-white/55" : "text-muted"
                    }`}
                  >
                    {link.label}
                  </p>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpen(false)}
                      className={`block py-2.5 pl-2 text-sm font-semibold ${
                        forceDark ? "text-white" : "text-fg"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              );
            }
            if (!link.href) {
              return (
                <span
                  key={link.label}
                  className={`block py-3 text-sm font-semibold cursor-default ${
                    forceDark ? "text-white/80" : "text-fg"
                  }`}
                >
                  {link.label}
                </span>
              );
            }
            if (link.href.startsWith("http")) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block py-3 text-sm font-semibold ${
                    forceDark ? "text-white" : "text-fg"
                  }`}
                >
                  {link.label}
                </a>
              );
            }
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block py-3 text-sm font-semibold ${
                  forceDark ? "text-white" : "text-fg"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/locations"
            className="btn-primary mt-2 w-full"
            onClick={() => setOpen(false)}
          >
            Find a Branch
          </Link>
        </div>
      )}
    </header>
  );
}
