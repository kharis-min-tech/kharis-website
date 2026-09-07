"use client";

import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";
import { ContentIcon } from "@/components/ContentIcon";
import { GOVERNANCE } from "@/lib/about-content";

export function GovernanceExperience() {
  return (
    <div className="gov-page">
      <header className="gov-hero">
        <Reveal>
          <p className="eyebrow">Governance</p>
          <h1 className="gov-hero__title">{GOVERNANCE.title}</h1>
          <p className="gov-hero__lede">{GOVERNANCE.lead}</p>
        </Reveal>
      </header>

      <section className="gov-policies" aria-label="Policy documents">
        <RevealStagger className="gov-policies__grid" stagger={0.1}>
          {GOVERNANCE.policies.map((policy) => (
            <RevealItem key={policy.id} className="gov-policy">
              <span className="gov-policy__icon">
                <ContentIcon name={policy.icon} className="h-10 w-10" />
              </span>
              <h2>{policy.title}</h2>
              <p>{policy.blurb}</p>
            </RevealItem>
          ))}
        </RevealStagger>
      </section>

      <section className="gov-incident" aria-label="Report an incident">
        <Reveal className="gov-incident__panel">
          <span className="gov-incident__icon">
            <ContentIcon name="shield-alert" className="h-11 w-11" />
          </span>
          <div>
            <h2>{GOVERNANCE.incident.title}</h2>
            <p>{GOVERNANCE.incident.blurb}</p>
          </div>
          <a
            href={GOVERNANCE.incident.href}
            target="_blank"
            rel="noreferrer"
            className="gov-incident__cta"
          >
            {GOVERNANCE.incident.cta}
          </a>
        </Reveal>
      </section>
    </div>
  );
}
