"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  "relative font-body-md text-[13px] font-bold uppercase tracking-wide text-on-background transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[3px] after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full";

const KP2_LOGO = "/assets/kp2-logo-new.png";

export function SiteHeader() {
  const pathname = usePathname();
  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/");
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest border-b-2 border-on-background shadow-[0_4px_0_0_var(--primary)]">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-[72px]">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="shrink-0 flex items-center group"
          >
            <img
              src={KP2_LOGO}
              alt="KP2 Kharis Phase 2"
              className="h-11 w-auto transition-transform duration-200 group-hover:-translate-y-0.5"
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
                >
                  <Link
                    href={item.to}
                    className={`${linkBase} flex items-center gap-1 ${openMenu === item.label || isActive(item.to) ? "text-primary after:w-full" : ""}`}
                  >
                    {item.label}
                    <span className="material-symbols-outlined text-[16px] leading-none">
                      expand_more
                    </span>
                  </Link>
                  <div
                    className={`absolute left-0 top-full pt-4 origin-top transition-all duration-300 ease-out ${
                      openMenu === item.label
                        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                        : "opacity-0 -translate-y-2 scale-[0.98] pointer-events-none"
                    }`}
                  >
                      <div className="w-64 bg-surface-container-lowest brutalist-border brutalist-shadow p-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.to}
                            href={child.to}
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
                  className={`${linkBase} ${isActive(item.to) ? "text-primary after:w-full" : ""}`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* CTA */}
          <div className="hidden xl:block shrink-0">
            <Link
              href="/branches"
              className="group inline-flex items-center gap-2 justify-center bg-primary !text-on-primary font-body-md text-[13px] font-bold uppercase tracking-wide px-6 py-3 brutalist-border brutalist-shadow transition-all duration-200 hover:bg-primary-container hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-1 active:translate-y-1"
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
            aria-label="Toggle navigation"
            aria-expanded={open}
            className="xl:hidden text-on-background transition-colors duration-200 hover:text-primary"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="material-symbols-outlined text-[32px]">{open ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`xl:hidden grid overflow-hidden transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
        <div className={`border-t-2 border-on-background bg-surface-container-lowest px-4 md:px-6 py-6 flex flex-col gap-1 max-h-[calc(100svh-74px)] overflow-y-auto transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "translate-y-0" : "-translate-y-3"}`}>
          {NAV_ITEMS.flatMap((item) =>
            item.children
              ? [
                  <Link
                    key={item.label}
                    href={item.to}
                    onClick={() => setOpen(false)}
                    className="font-body-md text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant pt-4 pb-1 transition-colors duration-150 hover:text-primary"
                  >
                    {item.label}
                  </Link>,
                  ...item.children.map((child) => (
                    <Link
                      key={child.to}
                      href={child.to}
                      onClick={() => setOpen(false)}
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
                    onClick={() => setOpen(false)}
                    className="py-3 px-3 font-body-md text-sm font-bold uppercase tracking-wide text-on-background transition-colors duration-150 relative after:absolute after:left-0 after:-bottom-1 after:h-[3px] after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full"
                  >
                    {item.label}
                  </Link>,
                ],
          )}
          <Link
            href="/branches"
            onClick={() => setOpen(false)}
            className="mt-4 bg-primary !text-on-primary font-body-md text-sm font-bold uppercase tracking-wide px-6 py-4 brutalist-border brutalist-shadow text-center transition-colors duration-200 hover:bg-primary-container"
          >
            Find a Branch
          </Link>
        </div>
        </div>
      </div>
    </header>
  );
}
