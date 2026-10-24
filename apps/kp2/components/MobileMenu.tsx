"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { INSTAGRAM_URL, TIKTOK_URL, YOUTUBE_URL } from "@/lib/social";
import "./mobile-menu.css";

export type MobileNavItem = {
  label: string;
  to: string;
  children?: { label: string; to: string; blurb: string }[];
};

const SECONDARY = [
  { label: "Kharis Main", href: "https://kharis.org/" },
  { label: "Instagram", href: INSTAGRAM_URL },
  { label: "YouTube", href: YOUTUBE_URL },
  { label: "TikTok", href: TIKTOK_URL },
];

export function MobileMenu({
  open,
  onClose,
  items,
  logo,
  isActive,
  isCurrent,
}: {
  open: boolean;
  onClose: () => void;
  items: MobileNavItem[];
  logo: string;
  isActive: (item: MobileNavItem) => boolean;
  isCurrent: (to: string) => boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const activeRef = useRef(isActive);
  activeRef.current = isActive;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    setExpanded(items.find((item) => item.children && activeRef.current(item))?.label ?? null);
    closeRef.current?.focus({ preventScroll: true });
  }, [open, items]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = sheetRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!focusable?.length) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="kp-mnav" data-open={open || undefined} inert={!open}>
      <div
        ref={sheetRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        className="kp-mnav__sheet"
      >
        <div className="kp-mnav__brand">
          <Link href="/" aria-label="KP2 home" onClick={onClose} className="kp-mnav__logo">
            <img src={logo} alt="" width={600} height={600} className="site-logo" />
          </Link>
          <button
            ref={closeRef}
            type="button"
            className="kp-mnav__close"
            aria-label="Close menu"
            onClick={onClose}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        <nav aria-label="Mobile" className="kp-mnav__links">
          {items.map((item, index) => {
            const style = { "--i": index } as CSSProperties;
            if (!item.children) {
              return (
                <div key={item.to} className="kp-mnav__item" style={style}>
                  <Link
                    href={item.to}
                    aria-current={isCurrent(item.to) ? "page" : undefined}
                    onClick={onClose}
                    className="kp-mnav__link"
                  >
                    {item.label}
                  </Link>
                </div>
              );
            }
            const isOpen = expanded === item.label;
            const panelId = `kp-mnav-${item.label.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <div key={item.label} className="kp-mnav__item" style={style}>
                <button
                  type="button"
                  className="kp-mnav__link kp-mnav__parent"
                  data-active={isActive(item) || undefined}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setExpanded(isOpen ? null : item.label)}
                >
                  {item.label}
                  <span className="material-symbols-outlined" aria-hidden="true">
                    expand_more
                  </span>
                </button>
                <div id={panelId} className="kp-mnav__sub" data-open={isOpen || undefined}>
                  <div className="kp-mnav__sub-inner" inert={!isOpen}>
                    {item.children.map((child) => (
                      <Link
                        key={child.to}
                        href={child.to}
                        aria-current={isCurrent(child.to) ? "page" : undefined}
                        onClick={onClose}
                        className="kp-mnav__child"
                      >
                        <strong>{child.label}</strong>
                        <span>{child.blurb}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="kp-mnav__bottom">
          <Link href="/branches" onClick={onClose} className="kp-mnav__cta">
            <span className="material-symbols-outlined" aria-hidden="true">
              location_on
            </span>
            Find a Branch
          </Link>
          <nav aria-label="More Kharis links" className="kp-mnav__secondary">
            {SECONDARY.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer noopener">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>,
    document.body,
  );
}
