"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { Reveal } from "@/components/Reveal";
import { getSiteTheme, subscribeSiteTheme } from "@/lib/theme";

type Props = {
  tone?: "onLight" | "onDark";
};

export function SiteFooter({ tone }: Props) {
  const theme = useSyncExternalStore(
    subscribeSiteTheme,
    getSiteTheme,
    () => "light" as const,
  );
  const resolved = tone ?? (theme === "dark" ? "onDark" : "onLight");
  const dark = resolved === "onDark";
  const linkHover = dark ? "hover:text-white" : "hover:text-purple";
  const muted = dark ? "text-white/55" : "text-muted";
  const heading = dark ? "text-white" : "text-fg";

  return (
    <footer
      className={`site-footer border-t ${
        dark
          ? "site-footer--dark border-white/10 bg-[#0d0914] text-white"
          : "border-line bg-bg"
      }`}
    >
      <Reveal variant="fade">
        <div className="site-footer__inner">
          <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Link href="/" aria-label="Kharis home">
              <BrandLogo tone={dark ? "onDark" : "onLight"} />
            </Link>
            <p className={`site-footer__tagline ${muted}`}>
              Changing the world with a touch of His grace.
            </p>
          </div>
          <div className="site-footer__col">
            <h5 className={`site-footer__heading ${heading}`}>About</h5>
            <ul className={`site-footer__links ${muted}`}>
              <li>
                <Link href="/about" className={linkHover}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/governance" className={linkHover}>
                  Governance
                </Link>
              </li>
              <li>
                <Link href="/contact" className={linkHover}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="site-footer__col">
            <h5 className={`site-footer__heading ${heading}`}>Get Involved</h5>
            <ul className={`site-footer__links ${muted}`}>
              <li>
                <a href="https://kharis.org/" className={linkHover}>
                  Become a member
                </a>
              </li>
              <li>
                <Link href="/life/departments" className={linkHover}>
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="/#share-testimony" className={linkHover}>
                  Testimony Form
                </Link>
              </li>
              <li>
                <Link href="/life/departments" className={linkHover}>
                  Departments
                </Link>
              </li>
            </ul>
          </div>
          <div className="site-footer__col">
            <h5 className={`site-footer__heading ${heading}`}>Join Us</h5>
            <ul className={`site-footer__links ${muted}`}>
              <li>
                <Link href="/locations" className={linkHover}>
                  Find a Location
                </Link>
              </li>
              <li>
                <Link href="/life" className={linkHover}>
                  Life
                </Link>
              </li>
              <li>
                <a href="https://kharis.org/" className={linkHover}>
                  KP2
                </a>
              </li>
              <li>
                <Link href="/life/k-group" className={linkHover}>
                  KGroup
                </Link>
              </li>
              <li>
                <Link href="/events" className={linkHover}>
                  Events
                </Link>
              </li>
              <li>
                <Link href="/messages" className={linkHover}>
                  Messages
                </Link>
              </li>
            </ul>
          </div>
          <div className="site-footer__col">
            <h5 className={`site-footer__heading ${heading}`}>Finance</h5>
            <ul className={`site-footer__links ${muted}`}>
              <li>
                <Link href="/give" className={linkHover}>
                  Giving
                </Link>
              </li>
              <li>
                <Link href="/give#building" className={linkHover}>
                  Building Fund
                </Link>
              </li>
            </ul>
            <div
              className={`site-footer__social ${
                dark ? "text-[#d4920a]" : "text-purple"
              }`}
            >
              <a
                href="https://www.youtube.com/@davidantwi"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="footer-social"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.5 4.5 12 4.5 12 4.5s-7.5 0-9.4.6A3 3 0 0 0 .5 7.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-4.8ZM9.8 15.5v-7l6.3 3.5-6.3 3.5Z"
                  />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/kharischurch"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="footer-social"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.6c0-.9.3-1.6 1.6-1.6h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.6v3.2h2.5V22h3.4Z"
                  />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/kharischurch"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="footer-social"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm6.1-8.1a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0ZM12 2.2c-2.2 0-2.5 0-3.4.05a5.8 5.8 0 0 0-1.9.36 3.9 3.9 0 0 0-1.4.9 3.9 3.9 0 0 0-.9 1.4 5.8 5.8 0 0 0-.36 1.9C4.2 9.5 4.2 9.8 4.2 12s0 2.5.05 3.4c.03.7.15 1.3.36 1.9.2.55.48 1 .9 1.4.4.42.85.7 1.4.9.6.21 1.2.33 1.9.36.9.05 1.2.05 3.4.05s2.5 0 3.4-.05c.7-.03 1.3-.15 1.9-.36.55-.2 1-.48 1.4-.9.42-.4.7-.85.9-1.4.21-.6.33-1.2.36-1.9.05-.9.05-1.2.05-3.4s0-2.5-.05-3.4a5.8 5.8 0 0 0-.36-1.9 3.9 3.9 0 0 0-.9-1.4 3.9 3.9 0 0 0-1.4-.9 5.8 5.8 0 0 0-1.9-.36C14.5 2.2 14.2 2.2 12 2.2Zm0 1.6c2.2 0 2.4 0 3.3.05.63.03 1 .13 1.23.22.32.12.55.27.79.5.23.24.38.47.5.79.09.24.19.6.22 1.23.04.86.05 1.12.05 3.3s0 2.44-.05 3.3a3.7 3.7 0 0 1-.22 1.23 1.9 1.9 0 0 1-.5.79c-.24.23-.47.38-.79.5-.24.09-.6.19-1.23.22-.86.04-1.12.05-3.3.05s-2.44 0-3.3-.05a3.7 3.7 0 0 1-1.23-.22 1.9 1.9 0 0 1-.79-.5 1.9 1.9 0 0 1-.5-.79 3.7 3.7 0 0 1-.22-1.23c-.04-.86-.05-1.12-.05-3.3s0-2.44.05-3.3c.03-.63.13-1 .22-1.23.12-.32.27-.55.5-.79.24-.23.47-.38.79-.5.24-.09.6-.19 1.23-.22.86-.04 1.12-.05 3.3-.05Z"
                  />
                </svg>
              </a>
            </div>
          </div>
          </div>
          <div className="site-footer__bottom">
            <p
              className={`site-footer__legal ${
                dark ? "text-white/40" : "text-muted"
              }`}
            >
              2026 Kharis Ministries | All Rights Reserved | Charity Number
              1139291
            </p>
            <Image
              src="/images/ea-logo-evangelical-alliance.png"
              alt="Evangelical Alliance"
              width={180}
              height={48}
              className={`site-footer__ea-logo ${
                dark ? "" : "site-footer__ea-logo--on-light"
              }`}
            />
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
