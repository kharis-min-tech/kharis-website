"use client";

import { MobileNavigation } from "@/components/MobileNavigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { Icon } from "@/components/Icon";
import { KP2_URL } from "@/lib/kp2";
import { getSiteTheme, subscribeSiteTheme } from "@/lib/theme";
import { getHeaderOverlay, subscribeHeaderOverlay } from "@/lib/header-overlay";

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
  { label: "Home", href: "/" },
  { label: "About", href: "/about", children: aboutChildren },
  { label: "KP2", href: KP2_URL },
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
  const siteTheme = useSyncExternalStore(subscribeSiteTheme, getSiteTheme, () => "light" as const);
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

  /* Sections underneath can request a clear or dark header with light text (see header-overlay). */
  const overlayMode = useSyncExternalStore(subscribeHeaderOverlay, getHeaderOverlay, () => null);
  const overlay = overlayMode !== null && !open;
  const overlayDark = overlay && overlayMode === "dark";

  /* The header floats clear over hero media and solidifies on scroll — in
   * BOTH themes. Dark mode used to force `solid` on from the first frame, so
   * the bar sat as an opaque slab over the hero video while light mode let it
   * breathe. Same behaviour either way now; only the colours differ. */
  const atTop = !scrolled && !open;
  const onDark = overlay ? true : forceLight ? false : forceDark ? true : atTop;
  const solid = overlay ? overlayDark : forceLight ? true : !atTop;

  const linkTone = (active: boolean) =>
    `k-motion inline-flex h-10 cursor-pointer items-center text-[13px] leading-none font-semibold tracking-wide transition-transform duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 ${
      onDark || (forceDark && !open)
        ? active
          ? "text-white"
          : "text-white/90 hover:text-white"
        : active
          ? "text-purple"
          : "text-fg-soft hover:text-purple"
    }`;

  const aboutActive =
    pathname === "/about" || pathname.startsWith("/about/") || pathname === "/governance";

  return (
    <header
      data-site-header
      data-smooth-nav
      className={`site-header fixed inset-x-0 top-0 z-50 transition-all duration-400 ${
        solid
          ? forceDark || overlayDark
            ? "site-header--solid site-header--solid-dark"
            : "site-header--solid site-header--solid-light"
          : "site-header--clear"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <Link href="/" aria-label="Kharis home" className="relative z-10">
          <BrandLogo tone={onDark || (forceDark && !open) ? "onDark" : "onLight"} />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => {
            if (link.children) {
              return (
                <div
                  key={link.label}
                  className="relative flex items-center"
                  ref={aboutRef}
                  onMouseEnter={() => setAboutOpen(true)}
                  onMouseLeave={() => setAboutOpen(false)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setAboutOpen(false);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setAboutOpen(false);
                      aboutRef.current?.querySelector("button")?.focus();
                    }
                  }}
                >
                  <button
                    type="button"
                    className={`${linkTone(aboutActive)} gap-1`}
                    aria-expanded={aboutOpen}
                    aria-haspopup="true"
                    onClick={(event) => {
                      // Pointer entry already opens the menu, so its click should keep it open.
                      setAboutOpen((value) => (event.detail === 0 ? !value : true));
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
                      event.preventDefault();
                      setAboutOpen(true);
                      const last = event.key === "ArrowUp";
                      window.requestAnimationFrame(() => {
                        const items = aboutRef.current?.querySelectorAll("a");
                        items?.[last ? items.length - 1 : 0]?.focus();
                      });
                    }}
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
                        className={`site-menu overflow-hidden border py-2 shadow-lg ${
                          onDark || forceDark ? "site-menu--dark" : "site-menu--light"
                        }`}
                      >
                        {link.children.map((child) => {
                          const active = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`k-motion block px-4 py-2.5 text-[13px] font-semibold transition ${
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
              (link.href && link.href !== "/" && pathname.startsWith(`${link.href}/`));
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
              <Link
                key={link.label}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={className}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {pathname === "/locations" ? null : (
            <Link
              href="/locations"
              className={`btn-header hidden sm:inline-flex ${
                siteDark
                  ? "btn-header--accent"
                  : onDark || (forceDark && !open)
                    ? "btn-header--on-dark"
                    : "btn-header--on-light"
              }`}
            >
              Find a Branch
              <Icon name="arrow" className="h-3.5 w-3.5" />
            </Link>
          )}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-controls={open ? "mobile-navigation" : undefined}
            aria-expanded={open}
            className={`mobile-menu-toggle cursor-pointer lg:hidden${open ? " is-open" : ""} ${
              onDark || (forceDark && !open) ? "text-white" : "text-fg"
            }`}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              className="mobile-menu-toggle__icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                className="mobile-menu-toggle__stroke mobile-menu-toggle__stroke--top"
                d="M4 6h16"
              />
              <path
                className="mobile-menu-toggle__stroke mobile-menu-toggle__stroke--middle"
                d="M4 12h16"
              />
              <path
                className="mobile-menu-toggle__stroke mobile-menu-toggle__stroke--bottom"
                d="M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <MobileNavigation
        open={open}
        onClose={() => setOpen(false)}
        pathname={pathname}
        dark={forceDark}
      />
    </header>
  );
}
