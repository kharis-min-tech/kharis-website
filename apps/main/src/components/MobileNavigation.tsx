"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { useDialog } from "@/lib/use-dialog";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { KP2_URL } from "@/lib/kp2";
import "./mobile-navigation.css";

const primary = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Messages", href: "/messages" },
  { label: "Life at Kharis", href: "/life" },
  { label: "Give", href: "/give" },
  { label: "Contact", href: "/contact" },
];
const aboutPages = [
  { label: "About us", href: "/about" },
  { label: "Governance", href: "/governance" },
];
const secondary = [{ label: "KP2", href: KP2_URL }];

export function MobileNavigation({
  open,
  onClose,
  pathname,
  dark,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  dark: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const aboutActive =
    pathname === "/about" || pathname.startsWith("/about/") || pathname.startsWith("/governance");
  const [aboutOpen, setAboutOpen] = useState(aboutActive);
  useEffect(() => {
    if (!open) setAboutOpen(aboutActive);
  }, [open, aboutActive]);
  const ref = useDialog(open, onClose);
  const reduce = usePrefersReducedMotion();
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const width = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (width.matches) onClose();
    };
    width.addEventListener("change", closeOnDesktop);
    return () => width.removeEventListener("change", closeOnDesktop);
  }, [onClose]);
  if (!mounted) return null;
  const current = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-navigation"
          className={`mobile-nav ${dark ? "mobile-nav--dark" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.18 }}
        >
          <button
            className="mobile-nav__backdrop"
            type="button"
            tabIndex={-1}
            aria-label="Close navigation backdrop"
            onClick={onClose}
          />
          <motion.div
            ref={ref}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            tabIndex={-1}
            className="mobile-nav__sheet"
            initial={reduce ? false : { y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: -12, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mobile-nav__brand-row">
              <Link href="/" aria-label="Kharis home" onClick={onClose}>
                <BrandLogo tone={dark ? "onDark" : "onLight"} />
              </Link>
              <button
                type="button"
                className="mobile-nav__close"
                aria-label="Close menu"
                onClick={onClose}
              >
                <X size={25} strokeWidth={1.7} aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Mobile" className="mobile-nav__links">
              {primary.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduce ? 0 : 0.32,
                    delay: reduce ? 0 : 0.06 + index * 0.025,
                  }}
                >
                  {item.href === "/about" ? (
                    <>
                      <button
                        type="button"
                        className="mobile-nav__parent"
                        data-current={aboutActive || undefined}
                        aria-expanded={aboutOpen}
                        aria-controls="mobile-about-pages"
                        onClick={() => setAboutOpen((value) => !value)}
                      >
                        <span>{item.label}</span>
                        <ChevronDown size={20} aria-hidden="true" />
                      </button>
                      <AnimatePresence initial={false}>
                        {aboutOpen && (
                          <motion.div
                            id="mobile-about-pages"
                            className="mobile-nav__submenu"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: reduce ? 0 : 0.25 }}
                          >
                            <nav aria-label="About Kharis pages">
                              {aboutPages.map((page) => (
                                <Link
                                  key={page.href}
                                  href={page.href}
                                  aria-current={current(page.href) ? "page" : undefined}
                                  onClick={onClose}
                                >
                                  {page.label}
                                </Link>
                              ))}
                            </nav>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={current(item.href) ? "page" : undefined}
                      onClick={onClose}
                    >
                      <span>{item.label}</span>
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>
            <div className="mobile-nav__bottom">
              <nav aria-label="More Kharis links" className="mobile-nav__secondary">
                {secondary.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-current={current(item.href) ? "page" : undefined}
                    onClick={onClose}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
