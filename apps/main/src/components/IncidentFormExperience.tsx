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
            If something needs attention, tell us. Your report helps us keep
            our church family safe. Use the form below, or open it in a new tab
            if the embed does not load on your device.
          </p>
          <div className="incident-actions">
            <a
              href={INCIDENT_FORM_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              Open Microsoft Form
            </a>
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
