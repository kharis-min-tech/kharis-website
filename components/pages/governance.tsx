"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";



const POLICIES = [
  {
    icon: "shield_person",
    title: "Safeguarding Policy",
    description:
      "How we protect children, young people and adults at risk across every Kharis gathering and activity.",
  },
  {
    icon: "lock",
    title: "Privacy Policy",
    description:
      "How we collect, use and look after personal information when you engage with Kharis Ministries.",
  },
  {
    icon: "info",
    title: "Website Disclaimer",
    description:
      "Important notes about information on this website and your use of our online spaces.",
  },
];

function GovernancePage() {
  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden">
      <SiteHeader />

      {/* Hero */}
      <section className="pt-[72px] px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto py-20 md:py-28">
        <div className="max-w-4xl">
          <span className="inline-block bg-secondary-container text-on-secondary-container font-label-md px-4 py-1 border-heavy mb-6 uppercase tracking-widest animate-bounce motion-reduce:animate-none">
            Governance
          </span>
          <h1 className="font-display-lg text-headline-lg md:text-display-lg text-on-surface dark:text-[#e8e0e9] uppercase leading-none mb-6">
            Policies to protect everyone
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-[#ccc3d8] max-w-2xl leading-relaxed">
            Our policy and practice guidance documents inform the governance of
            Kharis Ministries.
          </p>
        </div>
      </section>

      {/* Policy grid */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {POLICIES.map((policy) => (
            <div
              key={policy.title}
              className="bg-surface-container-lowest dark:bg-[#1c1820] border-heavy p-8 neo-shadow-hover transition-all group hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-[#f5f0f6] dark:bg-[#2a2430] border-heavy flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform">
                <span
                  className="material-symbols-outlined text-3xl text-primary"
                  data-weight="fill"
                >
                  {policy.icon}
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md uppercase mb-3 text-on-surface dark:text-[#e8e0e9]">
                {policy.title}
              </h3>
              <p className="font-body-md text-on-surface-variant dark:text-[#ccc3d8] leading-relaxed">
                {policy.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Report an incident banner */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto pb-24">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#4a154b] via-[#6b1f63] to-[#7c3aed] border-heavy neo-shadow p-8 md:p-12 lg:p-16">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5"></div>
          <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-white/5"></div>
          <div className="absolute inset-0 halftone-pattern text-white/5 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <span className="font-label-md uppercase tracking-widest text-white/70 mb-3 block">
                Report an Incident
              </span>
              <h2 className="font-headline-lg text-headline-lg uppercase text-white mb-4">
                If something needs attention, tell us
              </h2>
              <p className="font-body-lg text-white/85 leading-relaxed">
                Your report helps us keep our church family safe.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#4a154b] font-body-md text-sm font-bold uppercase tracking-wide px-8 py-4 border-heavy neo-shadow transition-all duration-150 hover:bg-secondary hover:text-on-secondary"
            >
              Report an Incident
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />

      <ThemeToggle />
    </div>
  );
}

export default GovernancePage;
