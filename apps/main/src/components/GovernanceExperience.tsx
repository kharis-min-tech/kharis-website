"use client";

import "./governance.css";

import { useEffect, useRef, useState } from "react";
import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";
import { ContentIcon } from "@/components/ContentIcon";
import { GOVERNANCE } from "@/lib/about-content";
import {
  PolicyDocumentReader,
  type PolicyDocumentReaderProps,
} from "../../../../shared/PolicyDocumentReader";

export type GovernancePolicyCard = {
  id: string;
  title: string;
  blurb: string;
  icon: string;
  href?: string;
  document?: Omit<PolicyDocumentReaderProps, "theme">;
};

export function GovernanceExperience({
  policies = GOVERNANCE.policies as unknown as GovernancePolicyCard[],
}: {
  policies?: GovernancePolicyCard[];
}) {
  const [openPolicyId, setOpenPolicyId] = useState<string | null>(null);
  const readerRef = useRef<HTMLElement>(null);
  const openPolicy = policies.find((policy) => policy.id === openPolicyId && policy.document);

  useEffect(() => {
    if (!openPolicy) return;
    readerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [openPolicy]);

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
          {policies.map((policy) => (
            <RevealItem key={policy.id} id={policy.id} className="gov-policy">
              {policy.document ? (
                <button
                  type="button"
                  className="gov-policy__link gov-policy__button"
                  aria-expanded={openPolicyId === policy.id}
                  aria-controls="governance-policy-reader"
                  onClick={() =>
                    setOpenPolicyId((current) => (current === policy.id ? null : policy.id))
                  }
                >
                  <span className="gov-policy__icon">
                    <ContentIcon name={policy.icon} className="h-10 w-10" />
                  </span>
                  <h2>{policy.title}</h2>
                  <p>{policy.blurb}</p>
                  <span className="gov-policy__action">
                    {openPolicyId === policy.id ? "Close document" : "Read full document"}
                    <span aria-hidden="true">{openPolicyId === policy.id ? "↑" : "↓"}</span>
                  </span>
                </button>
              ) : policy.href ? (
                <a
                  href={policy.href}
                  className="gov-policy__link"
                  {...(policy.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <span className="gov-policy__icon">
                    <ContentIcon name={policy.icon} className="h-10 w-10" />
                  </span>
                  <h2>{policy.title}</h2>
                  <p>{policy.blurb}</p>
                </a>
              ) : (
                <>
                  <span className="gov-policy__icon">
                    <ContentIcon name={policy.icon} className="h-10 w-10" />
                  </span>
                  <h2>{policy.title}</h2>
                  <p>{policy.blurb}</p>
                </>
              )}
            </RevealItem>
          ))}
        </RevealStagger>
      </section>

      {openPolicy?.document ? (
        <section
          id="governance-policy-reader"
          ref={readerRef}
          className="gov-policy-reader"
          aria-label={`${openPolicy.title} full text`}
        >
          <div className="gov-policy-reader__toolbar">
            <button type="button" onClick={() => setOpenPolicyId(null)}>
              Close document <span aria-hidden="true">↑</span>
            </button>
          </div>
          <PolicyDocumentReader key={openPolicy.id} {...openPolicy.document} theme="main" />
        </section>
      ) : null}

      <section className="gov-incident" aria-label="Report an incident">
        <Reveal className="gov-incident__panel">
          <span className="gov-incident__icon">
            <ContentIcon name="shield-alert" className="h-11 w-11" />
          </span>
          <div>
            <h2>{GOVERNANCE.incident.title}</h2>
            <p>{GOVERNANCE.incident.blurb}</p>
          </div>
          <a href={GOVERNANCE.incident.href} className="gov-incident__cta">
            {GOVERNANCE.incident.cta}
          </a>
        </Reveal>
      </section>
    </div>
  );
}
