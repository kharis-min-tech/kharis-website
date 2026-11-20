"use client";

import "./governance.css";

import { useState } from "react";
import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";
import { ContentIcon } from "@/components/ContentIcon";
import { GOVERNANCE } from "@/lib/about-content";
import { PolicyPdfDialog, type PolicyPdfDocument } from "../../../../shared/PolicyPdfDialog";

export type GovernancePolicyCard = {
  id: string;
  title: string;
  blurb: string;
  icon: string;
  href?: string;
  document?: PolicyPdfDocument;
};

export function GovernanceExperience({
  policies = GOVERNANCE.policies as unknown as GovernancePolicyCard[],
}: {
  policies?: GovernancePolicyCard[];
}) {
  const [openPolicyId, setOpenPolicyId] = useState<string | null>(null);
  const openPolicy = policies.find((policy) => policy.id === openPolicyId && policy.document);

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
                  aria-haspopup="dialog"
                  onClick={() => setOpenPolicyId(policy.id)}
                >
                  <span className="gov-policy__icon">
                    <ContentIcon name={policy.icon} className="h-10 w-10" />
                  </span>
                  <h2>{policy.title}</h2>
                  <p>{policy.blurb}</p>
                  <span className="gov-policy__action">
                    Read full PDF <span aria-hidden="true">↗</span>
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

      <PolicyPdfDialog
        document={openPolicy?.document ?? null}
        onClose={() => setOpenPolicyId(null)}
        theme="main"
      />

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
