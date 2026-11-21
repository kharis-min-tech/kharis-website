"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { INCIDENT_FORM_URL } from "@/lib/about-content";

export function IncidentFormExperience() {
  return (
    <div className="incident-page">
      <header className="incident-hero">
        <Reveal>
          <p className="eyebrow">Governance</p>
          <h1>Report an incident</h1>
          <p>
            If something needs attention, tell us. Your report helps us keep our church family safe.
            Fill in the form below.
          </p>
          <div className="incident-actions">
            <Link href="/governance" className="btn-ghost">
              Back to governance
            </Link>
          </div>
        </Reveal>
      </header>

      <div className="incident-embed">
        <iframe
          title="Kharis incident report form"
          src={INCIDENT_FORM_URL}
          className="incident-embed__frame"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allow="fullscreen"
        />
      </div>
    </div>
  );
}
