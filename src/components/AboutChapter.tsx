"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  imagePosition?: string;
  children: ReactNode;
  next?: { href: string; label: string };
};

export function AboutChapter({
  eyebrow,
  title,
  subtitle,
  image,
  imagePosition = "object-center",
  children,
  next,
}: Props) {
  return (
    <div className="about-chapter">
      <header className="about-chapter__hero">
        <div className="about-chapter__hero-media" aria-hidden>
          <Image
            src={image}
            alt=""
            fill
            priority
            className={`object-cover ${imagePosition}`}
            sizes="100vw"
          />
          <div className="about-chapter__hero-veil" />
        </div>
        <div className="about-chapter__hero-copy">
          <p className="about-chapter__eyebrow">{eyebrow}</p>
          <h1 className="about-chapter__title">{title}</h1>
          <p className="about-chapter__sub">{subtitle}</p>
        </div>
      </header>

      <div className="about-chapter__body">{children}</div>

      <nav className="about-chapter__nav" aria-label="About pages">
        <Link href="/about">About</Link>
        <Link href="/about/mission">Mission</Link>
        <Link href="/about/vision">Vision</Link>
        <Link href="/about/leadership">Leadership</Link>
        {next ? (
          <Link href={next.href} className="about-chapter__next">
            {next.label}
          </Link>
        ) : null}
      </nav>
    </div>
  );
}

export function ChapterPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={`about-chapter__panel ${className}`}>{children}</Reveal>
  );
}
