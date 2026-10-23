"use client";

import Link from "next/link";
import { type ComponentType } from "react";
import "./social-stack.css";

export type SocialPlatform = {
  label: string;
  handle: string;
  copy: string;
  href: string;
  cta: string;
  Icon: ComponentType<{ className?: string }>;
  band: string;
  external?: boolean;
};

export function SocialStack({ platforms }: { platforms: SocialPlatform[] }) {
  return (
    <section
      id="follow"
      className="kp-stack scroll-mt-28"
      aria-labelledby="kp-stack-title"
      style={{ ["--count" as string]: platforms.length }}
    >
      <div className="kp-stack__aside">
        <p className="kp-stack__narration">Follow · Watch · Listen</p>
        <h2 id="kp-stack-title" className="kp-stack__title">
          Our social media <span>platforms</span>
        </h2>
        <p className="kp-stack__lede">Every place KP2 shows up online.</p>
        <div className="kp-stack__tag">
          <span className="material-symbols-outlined" aria-hidden="true">
            campaign
          </span>
          <div>
            <h3>Tag us</h3>
            <p>
              Use <strong>#KharisPhase2</strong> and we might reshare your moment.
            </p>
          </div>
        </div>
      </div>

      <ol className="kp-stack__list">
        {platforms.map(({ label, handle, copy, href, cta, Icon, band, external = true }, i) => (
          <li key={label} className="kp-stack__item" style={{ ["--i" as string]: i }}>
            <Link
              href={href}
              {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
              className="kp-stack__card no-accent-fill"
            >
              <div className={`kp-stack__band ${band}`}>
                <Icon className="kp-stack__icon" />
                <div className="kp-stack__who">
                  <h3>{label}</h3>
                  <p>{handle}</p>
                </div>
                <span className="kp-stack__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="kp-stack__body">
                <p>{copy}</p>
                <span className="kp-stack__cta">
                  {cta}
                  <span className="material-symbols-outlined" aria-hidden="true">
                    arrow_forward
                  </span>
                </span>
              </div>
              <span className="kp-stack__shade" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
