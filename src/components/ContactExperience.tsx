"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Navigation,
  Phone,
  Search,
} from "lucide-react";
import { BranchMap } from "@/components/BranchMap";
import { Reveal } from "@/components/Reveal";
import type { ContactLocation } from "@/lib/contactLocations";

const SUBJECTS = [
  { value: "General", label: "General Inquiry" },
  { value: "Sunday visit", label: "Sunday visit" },
  { value: "Prayer", label: "Prayer" },
  { value: "Giving", label: "Giving" },
  { value: "Pastoral", label: "Pastoral" },
] as const;

type Props = {
  locations: ContactLocation[];
};

function getPrimaryVenue(branch: ContactLocation) {
  return branch.venues?.[0] ?? null;
}

function getBranchCity(branch: ContactLocation) {
  return getPrimaryVenue(branch)?.city ?? "";
}

function getBranchAddress(branch: ContactLocation) {
  const venue = getPrimaryVenue(branch);

  if (!venue) return "";

  return [
    venue.name,
    venue.address_line1,
    venue.address_line2,
    venue.city,
    venue.postcode,
  ]
    .filter(Boolean)
    .join(", ");
}

function getDirectionsUrl(branch: ContactLocation) {
  const venue = getPrimaryVenue(branch);

  if (!venue) return "#";

  const destination = [
    venue.name,
    venue.address_line1,
    venue.address_line2,
    venue.city,
    venue.postcode,
  ]
    .filter(Boolean)
    .join(", ");

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    destination,
  )}`;
}

const THANKS_DISMISS_MS = 6500;

function SocialGlyph({ name }: { name: "instagram" | "youtube" | "facebook" }) {
  if (name === "youtube") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          fill="currentColor"
          d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.5 4.5 12 4.5 12 4.5s-7.5 0-9.4.6A3 3 0 0 0 .5 7.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-4.8ZM9.8 15.5v-7l6.3 3.5-6.3 3.5Z"
        />
      </svg>
    );
  }
  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          fill="currentColor"
          d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.6c0-.9.3-1.6 1.6-1.6h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.6v3.2h2.5V22h3.4Z"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="currentColor"
        d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm6.1-8.1a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0ZM12 2.2c-2.2 0-2.5 0-3.4.05a5.8 5.8 0 0 0-1.9.36 3.9 3.9 0 0 0-1.4.9 3.9 3.9 0 0 0-.9 1.4 5.8 5.8 0 0 0-.36 1.9C4.2 9.5 4.2 9.8 4.2 12s0 2.5.05 3.4c.03.7.15 1.3.36 1.9.2.55.48 1 .9 1.4.4.42.85.7 1.4.9.6.21 1.2.33 1.9.36.9.05 1.2.05 3.4.05s2.5 0 3.4-.05c.7-.03 1.3-.15 1.9-.36.55-.2 1-.48 1.4-.9.42-.4.7-.85.9-1.4.21-.6.33-1.2.36-1.9.05-.9.05-1.2.05-3.4s0-2.5-.05-3.4a5.8 5.8 0 0 0-.36-1.9 3.9 3.9 0 0 0-.9-1.4 3.9 3.9 0 0 0-1.4-.9 5.8 5.8 0 0 0-1.9-.36C14.5 2.2 14.2 2.2 12 2.2Zm0 1.6c2.2 0 2.4 0 3.3.05.63.03 1 .13 1.23.22.32.12.55.27.79.5.23.24.38.47.5.79.09.24.19.6.22 1.23.04.86.05 1.12.05 3.3s0 2.44-.05 3.3a3.7 3.7 0 0 1-.22 1.23 1.9 1.9 0 0 1-.5.79c-.24.23-.47.38-.79.5-.24.09-.6.19-1.23.22-.86.04-1.12.05-3.3.05s-2.44 0-3.3-.05a3.7 3.7 0 0 1-1.23-.22 1.9 1.9 0 0 1-.79-.5 1.9 1.9 0 0 1-.5-.79 3.7 3.7 0 0 1-.22-1.23c-.04-.86-.05-1.12-.05-3.3s0-2.44.05-3.3c.03-.63.13-1 .22-1.23.12-.32.27-.55.5-.79.24-.23.47-.38.79-.5.24-.09.6-.19 1.23-.22.86-.04 1.12-.05 3.3-.05Z"
      />
    </svg>
  );
}

const SOCIALS = [
  {
    label: "INSTAGRAM",
    href: "https://www.instagram.com/kharischurch",
    icon: "instagram" as const,
  },
  {
    label: "YOUTUBE",
    href: "https://www.youtube.com/@davidantwi",
    icon: "youtube" as const,
  },
  {
    label: "FACEBOOK",
    href: "https://www.facebook.com/kharischurch",
    icon: "facebook" as const,
  },
] as const;

function splitName(full: string) {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0]!, last: parts[0]! };
  return { first: parts[0]!, last: parts.slice(1).join(" ") };
}

export function ContactExperience({ locations }: Props) {
  const CONTACT_BRANCHES = useMemo(
    () => locations.filter((b) => !b.name.startsWith("KP2")),
    [locations],
  );

  const HQ =
    CONTACT_BRANCHES.find((b) => b.name === "Kharis London") ??
    CONTACT_BRANCHES[0] ??
    null;
  const [region, setRegion] = useState<
    "all" | "United Kingdom" | "International"
  >("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<ContactLocation | null>(HQ);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "General",
    branch: HQ.name ?? "",
    message: "",
  });
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return CONTACT_BRANCHES.filter((branch) => {
      const venue = getPrimaryVenue(branch);
      const country = venue?.country ?? "";
      const city = venue?.city ?? "";
      const address = getBranchAddress(branch);

      if (region === "United Kingdom" && country !== "United Kingdom") {
        return false;
      }

      if (region === "International" && country === "United Kingdom") {
        return false;
      }

      if (!q) return true;

      return (
        branch.name.toLowerCase().includes(q) ||
        city.toLowerCase().includes(q) ||
        address.toLowerCase().includes(q)
      );
    });
  }, [CONTACT_BRANCHES, query, region]);

  useEffect(() => {
    if (!sent) return;
    const timer = window.setTimeout(() => setSent(false), THANKS_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [sent]);

  const selectBranch = (branch: ContactLocation) => {
    setActive(branch);
    setForm((f) => ({ ...f, branch: branch.name }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { first, last } = splitName(form.name);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          first,
          last,
          email: form.email,
          phone: "",
          topic: form.topic,
          branch: form.branch,
          message: form.message,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Please check the form and try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const thanksName = splitName(form.name).first;

  return (
    <div className="contact-page">
      <header className="contact-hero">
        <div
          className="contact-hero__media"
          style={{ backgroundImage: "url(/images/events/hero-worship.jpg)" }}
        />
        <div className="contact-hero__veil" />
        <div className="contact-hero__inner">
          <Reveal variant="blur" className="contact-hero__copy" amount={0.05}>
            <h1>Contact us</h1>
            <p>
              We are here for you. Whether you have a question, a prayer
              request, or just want to say hi.
            </p>
            <div className="contact-hero__bars" aria-hidden>
              <span className="contact-hero__bar contact-hero__bar--gold" />
              <span className="contact-hero__bar contact-hero__bar--purple" />
              <span className="contact-hero__bar contact-hero__bar--grey" />
            </div>
          </Reveal>
        </div>
      </header>

      <section className="contact-body" aria-label="Message Kharis">
        <div className="contact-shell">
          <Reveal className="contact-form-wrap" amount={0.05}>
            {sent ? (
              <div className="contact-thanks" role="status">
                <CheckCircle2 className="h-8 w-8" aria-hidden />
                <h3>Thank you, {thanksName}.</h3>
                <p>
                  We have your message. Someone from Kharis will reply to{" "}
                  <strong>{form.email}</strong>
                  {form.branch ? ` about ${form.branch}` : ""}.
                </p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={onSubmit} noValidate>
                <h2>Send a message</h2>
                <div className="contact-form__row">
                  <label>
                    Your name
                    <input
                      required
                      autoComplete="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Email address
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      placeholder="hello@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="contact-form__row">
                  <label>
                    Subject
                    <select
                      value={form.topic}
                      onChange={(e) =>
                        setForm({ ...form, topic: e.target.value })
                      }
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Branch
                    <select
                      value={form.branch}
                      onChange={(e) => {
                        const branch = CONTACT_BRANCHES.find(
                          (b) => b.name === e.target.value,
                        );
                        if (branch) selectBranch(branch);
                      }}
                    >
                      {CONTACT_BRANCHES.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  Message
                  <textarea
                    required
                    rows={7}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="How can we help?"
                  />
                </label>
                {error ? <p className="contact-error">{error}</p> : null}
                <button
                  type="submit"
                  className="contact-submit"
                  disabled={busy}
                >
                  {busy ? "Sending…" : "Send it!"}
                </button>
              </form>
            )}
          </Reveal>

          <aside className="contact-side">
            <Reveal variant="right" className="contact-hub">
              <h2>Church hub</h2>
              <ul>
                <li>
                  <MapPin className="h-4 w-4" aria-hidden />
                  <div>
                    <strong>Main campus</strong>
                    <span>
                      {HQ ? getBranchAddress(HQ) : "Address Unavailiable"}
                    </span>
                  </div>
                </li>
                <li>
                  <Clock className="h-4 w-4" aria-hidden />
                  <div>
                    <strong>Service times</strong>
                    <span>Sunday: 10:00 AM</span>
                    <span>Thursday: 7:00 PM</span>
                  </div>
                </li>
                <li>
                  <Phone className="h-4 w-4" aria-hidden />
                  <div>
                    <strong>Call us</strong>
                    {HQ?.contact_phone ? (
                      <a href={`tel:${HQ.contact_phone.replace(/\D/g, "")}`}>
                        {HQ.contact_phone}
                      </a>
                    ) : (
                      <span>Phone unavailable</span>
                    )}{" "}
                  </div>
                </li>
              </ul>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="contact-map-section" aria-label="Find a branch">
        <div className="contact-map-section__inner">
          <Reveal variant="up" className="contact-map-section__head">
            <div>
              <p className="contact-map-section__eyebrow">Locations</p>
              <h2>Find us here</h2>
            </div>
            <a
              href={active ? getDirectionsUrl(active) : "#"}
              target="_blank"
              rel="noreferrer"
              className="contact-map-head__dir"
            >
              Get directions
              <Navigation className="h-3.5 w-3.5" aria-hidden />
            </a>
          </Reveal>

          <Reveal
            variant="up"
            delay={0.06}
            className="contact-map-section__tools"
          >
            <div className="contact-search">
              <Search className="h-4 w-4" aria-hidden />
              <input
                type="search"
                placeholder="Search a city or branch"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search branches"
              />
            </div>
            <div className="contact-regions" role="tablist" aria-label="Region">
              {(["all", "United Kingdom", "International"] as const).map(
                (id) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={region === id}
                    className={region === id ? "is-on" : ""}
                    onClick={() => setRegion(id)}
                  >
                    {id === "all"
                      ? "All"
                      : id === "United Kingdom"
                        ? "UK"
                        : "International"}
                  </button>
                ),
              )}
            </div>
          </Reveal>

          <Reveal
            variant="up"
            delay={0.1}
            className="contact-map-section__grid"
          >
            <ul className="contact-branches">
              {filtered.map((branch) => {
                const venue = getPrimaryVenue(branch);

                return (
                  <li key={branch.id}>
                    <button
                      type="button"
                      className={`contact-branch${
                        active?.id === branch.id ? " is-on" : ""
                      }`}
                      onClick={() => selectBranch(branch)}
                    >
                      <MapPin className="h-4 w-4" aria-hidden />

                      <span>
                        <strong>{branch.name}</strong>

                        <em>
                          {venue
                            ? [venue.address_line1, venue.city]
                                .filter(Boolean)
                                .join(" · ")
                            : "Location unavailable"}
                        </em>
                      </span>
                    </button>
                  </li>
                );
              })}
              {filtered.length === 0 ? (
                <li className="contact-empty">
                  No branches match that search.
                </li>
              ) : null}
            </ul>

              <div className="contact-map-section__map">
                {active ? (
                  <iframe
                    title={`Map for ${active.name}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      getBranchAddress(active),
                    )}&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : null}

                {active && (
                  <div className="contact-map-section__caption">
                    <div>
                      <p>{active.name}</p>
                      <span>{getBranchAddress(active)}</span>
                    </div>
                  </div>
                )}
              </div>
            
          </Reveal>
        </div>
      </section>

      <section className="contact-vibe" aria-label="Follow Kharis">
        <div
          className="contact-vibe__media"
          style={{ backgroundImage: "url(/images/events/hero-worship.jpg)" }}
        />
        <div className="contact-vibe__veil" />
        <div className="contact-vibe__inner">
          <Reveal variant="left">
            <h2>Follow the vibe</h2>
          </Reveal>
          <Reveal variant="right" className="contact-vibe__links">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="contact-vibe__btn"
              >
                <SocialGlyph name={social.icon} />
                {social.label}
              </a>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
