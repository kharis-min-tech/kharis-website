"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Play, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { useDialog } from "@/lib/use-dialog";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { KP2_URL } from "@/lib/kp2";
import "./mobile-navigation.css";

const primary = [
  { label: "I’m new", href: "/about" },
  { label: "Get connected", href: "/life" },
  { label: "What’s on", href: "/events" },
  { label: "Watch & listen", href: "/messages" },
  { label: "Give", href: "/give" },
];
const secondary = [
  { label: "Home", href: "/" },
  { label: "Contact", href: "/contact" },
  { label: "Governance", href: "/governance" },
  { label: "KP2", href: KP2_URL },
];

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
            <Link href="/messages" className="mobile-nav__announcement" onClick={onClose}>
              <Play size={16} aria-hidden="true" />
              <span>Watch a message. Be encouraged.</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
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
                    delay: reduce ? 0 : 0.07 + index * 0.035,
                  }}
                >
                  <Link
                    href={item.href}
                    aria-current={current(item.href) ? "page" : undefined}
                    onClick={onClose}
                  >
                    <span>{item.label}</span>
                    <ArrowRight size={23} strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mobile-nav__bottom">
              <Link href="/locations" onClick={onClose} className="mobile-nav__locations">
                <span>Find your Kharis family</span>
                <span className="mobile-nav__locations-arrow">
                  <ArrowRight size={24} aria-hidden="true" />
                </span>
              </Link>
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
