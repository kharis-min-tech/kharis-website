"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { useState } from "react";
import { BANK, ONLINE_GIVE_URL } from "@/lib/giving";
import type { GivingTestimony } from "@/lib/testimonies";
import { TestimonyQuote } from "@/components/TestimonyQuote";

function GivingTestimonyCard({
  testimony,
  rotate,
}: {
  testimony: GivingTestimony;
  rotate: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-on-background/10 p-6 sm:p-8 md:p-12 neo-shadow flex flex-col md:flex-row gap-6 md:gap-8 items-start">
      <div
        className={`w-32 h-32 md:w-48 md:h-48 rounded-2xl border border-on-background/10 shrink-0 bg-cover bg-center transform ${rotate}`}
        style={{ backgroundImage: `url('${testimony.image}')` }}
        role="img"
        aria-label={`${testimony.name} portrait`}
      />
      <div className="min-w-0">
        <span className="material-symbols-outlined text-primary text-4xl mb-2 md:mb-4 block">format_quote</span>
        <TestimonyQuote
          quote={testimony.quote}
          name={testimony.name}
          meta={testimony.role}
          className="font-body-lg italic text-on-surface leading-relaxed"
        />
        <h4 className="font-headline-md text-2xl uppercase mt-6">— {testimony.name}</h4>
        <p className="font-label-sm text-primary uppercase">{testimony.role}</p>
      </div>
    </div>
  );
}

function GivingPage({ testimonies }: { testimonies: GivingTestimony[] }) {
  const [showBank, setShowBank] = useState(false);
  const [testimony, setTestimony] = useState(0);
  return (

    <div className="bg-background text-on-background font-body-md selection:bg-secondary-container selection:text-on-secondary-container">


<SiteHeader />
<main className="pt-20">

<section className="relative min-h-[560px] md:min-h-[700px] lg:min-h-[819px] flex items-center justify-center bg-[#06070a] overflow-hidden px-margin-mobile md:px-margin-desktop">
<div className="absolute inset-0 opacity-40">
<div className="w-full h-full bg-cover bg-center" data-alt="Kharis vision campaign" style={{backgroundImage: "url('/assets/vision-campaign.jpg')"}}></div>
</div>

<div className="absolute inset-0 vibe-mesh"></div>
<div className="relative z-10 text-center max-w-4xl">
<div className="inline-block rounded-full bg-amber text-[#1a0b00] px-4 py-1 font-label-md text-label-md uppercase mb-6">
                    Impact Through Grace
                </div>
<h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-white mb-8 tracking-tighter uppercase">
                    Your Generosity <br/>
<span className="text-secondary-fixed">Powers the Mission</span>
</h1>
<p className="font-body-lg text-body-lg text-white/80 mb-10 max-w-2xl mx-auto">
                    Kharis Phase 2 is about expanding our reach and deepening our impact. Every seed sown directly supports community outreach, digital fellowship, and regional development.
                </p>
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <a href={ONLINE_GIVE_URL} target="_blank" rel="noreferrer" className="w-full md:w-auto bg-primary text-on-primary rounded-2xl border border-on-background/10 neo-shadow-lg px-12 py-4 font-headline-md text-2xl hover:scale-105 transition-all">
                        GIVE ONLINE NOW
                    </a>
                </div>
</div>
</section>

<section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto bg-background">
<div className="mb-stack-lg max-w-3xl">
<h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase mb-4">Why We Give</h2>
<div className="h-2 w-32 bg-primary rounded-2xl border border-on-background/10 mb-4"></div>
<p className="font-body-lg text-body-lg text-on-surface-variant">Giving is an act of worship, faith, and love. It fuels the mission, cares for people, and plants seeds for the next generation.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">

<div className="bg-surface-container-low rounded-2xl border border-on-background/10 p-8 vibe-card relative overflow-hidden group">
<span className="material-symbols-outlined text-primary text-5xl mb-4">volunteer_activism</span>
<h3 className="font-headline-md text-headline-md uppercase mb-4">Worship &amp; Obedience</h3>
<p className="text-on-surface-variant font-body-md">We give because God gave first. Our offerings are a response to His grace and a step of faith.</p>
</div>

<div className="bg-secondary-container rounded-2xl border border-on-background/10 p-8 neo-shadow relative group">
<span className="material-symbols-outlined text-on-secondary-container text-5xl mb-4">favorite</span>
<h3 className="font-headline-md text-headline-md uppercase mb-4">Care for People</h3>
<p className="text-on-secondary-container font-body-md">Generosity meets real needs in our community — from food support to mentorship and crisis relief.</p>
<div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
</div>

<div className="bg-white rounded-2xl border border-on-background/10 p-8 neo-shadow">
<span className="material-symbols-outlined text-primary text-5xl mb-4">groups_2</span>
<h3 className="font-headline-md text-headline-md uppercase mb-4">Build Community</h3>
<p className="text-on-surface-variant font-body-md">Every gift helps create spaces where people can belong, grow, and discover their purpose.</p>
</div>

<div className="bg-surface-container-highest rounded-2xl border border-on-background/10 p-8 neo-shadow flex flex-col justify-between">
<div>
<span className="material-symbols-outlined text-primary text-5xl mb-4">auto_awesome</span>
<h3 className="font-headline-md text-headline-md uppercase mb-4">Advance the Mission</h3>
<p className="text-on-surface-variant font-body-md mb-6">From local outreach to media and new branches, giving sends the message of Kharis further.</p>
</div>
<Link href="/mission" className="text-primary font-label-md uppercase flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                            Learn more <span className="material-symbols-outlined">arrow_forward</span>
</Link>
</div>
</div>
</section>

<section className="py-stack-lg bg-surface-container-low px-margin-mobile md:px-margin-desktop">
<div className="max-w-7xl mx-auto text-center mb-stack-lg">
<h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase mb-4">Ways to Give</h2>
<p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">Choose the method that is most convenient for you. All transactions are securely encrypted.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter max-w-7xl mx-auto">

<div className="bg-white rounded-2xl border border-on-background/10 p-10 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform">
<div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
<span className="material-symbols-outlined text-primary text-4xl">language</span>
</div>
<h3 className="font-headline-md text-headline-md uppercase mb-4">Online Portal</h3>
<p className="font-body-md text-on-surface-variant mb-8 flex-grow">A secure, one-click way to give using your credit card or PayPal account.</p>
<a href={ONLINE_GIVE_URL} target="_blank" rel="noreferrer" className="w-full bg-primary text-on-primary rounded-2xl border border-on-background/10 neo-shadow py-3 font-label-md uppercase tracking-widest hover:bg-primary-container transition-colors">
                        GIVE ONLINE
                    </a>
</div>

<div className="bg-primary text-on-primary rounded-2xl border border-on-background/10 p-10 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform">
<div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
<span className="material-symbols-outlined text-white text-4xl">smartphone</span>
</div>
<h3 className="font-headline-md text-headline-md uppercase mb-4">Mobile App</h3>
<p className="font-on-primary/80 font-body-md mb-8 flex-grow">Download the Kharis Hub app. Manage recurring giving and track your history easily.</p>
<button className="w-full bg-white text-primary rounded-2xl border border-on-background/10 neo-shadow py-3 font-label-md uppercase tracking-widest hover:bg-surface-variant transition-colors">
                        GET THE APP
                    </button>
</div>

<div className="bg-white rounded-2xl border border-on-background/10 p-10 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform">
<div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
<span className="material-symbols-outlined text-primary text-4xl">account_balance</span>
</div>
<h3 className="font-headline-md text-headline-md uppercase mb-4">Bank Transfer</h3>
<p className="font-body-md text-on-surface-variant mb-8 flex-grow">Direct deposits for large donations or structured monthly transfers.</p>
<button onClick={() => setShowBank((v) => !v)} className="w-full bg-white text-black rounded-2xl border border-on-background/10 neo-shadow py-3 font-label-md uppercase tracking-widest hover:bg-surface-container transition-colors">
                        VIEW DETAILS
                    </button>
<div className={`${showBank ? "" : "hidden"} mt-6 text-left font-label-sm p-4 bg-surface-container-high w-full rounded-2xl border-t border-on-background/10`} id="bank-details">
<p>A/C: {BANK.accountNumber}</p>
<p>Sort: {BANK.sortCode}</p>
<p>Name: {BANK.accountName}</p>
</div>

</div>
</div>
</section>

{testimonies.length > 0 ? (
<section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto overflow-hidden">
<div className="mb-stack-lg flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
<div className="max-w-2xl">
<h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase mb-4">Living Testimonies</h2>
<p className="font-body-lg text-on-surface-variant">Real stories of transformation through the power of collective generosity.</p>
</div>
<div className="flex gap-4 md:hidden">
<button type="button" aria-label="Previous testimony" onClick={() => setTestimony((i) => (i + testimonies.length - 1) % testimonies.length)} className="w-12 h-12 rounded-2xl border border-on-background/10 flex items-center justify-center neo-shadow bg-white text-black active:active-neo-shadow">
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button type="button" aria-label="Next testimony" onClick={() => setTestimony((i) => (i + 1) % testimonies.length)} className="w-12 h-12 rounded-2xl border border-on-background/10 flex items-center justify-center neo-shadow bg-white text-black active:active-neo-shadow">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>

{/* Mobile: one testimony at a time. Desktop: both side by side. */}
<div className="md:hidden">
{testimonies.filter((_, i) => i === testimony).map((t) => (
  <GivingTestimonyCard key={t.name} testimony={t} rotate="-rotate-3" />
))}
<div className="mt-6 flex justify-center gap-2">
{testimonies.map((t, i) => (
<button key={t.name} type="button" aria-label={`Show testimony ${i + 1}`} aria-current={i === testimony ? "true" : undefined} onClick={() => setTestimony(i)} className="h-11 min-w-11 flex items-center justify-center">
<span className={`block h-3 rounded-full transition-all ${i === testimony ? "w-9 bg-primary" : "w-3 bg-on-background/20"}`} />
</button>
))}
</div>
</div>

<div className="hidden md:grid md:grid-cols-2 gap-gutter">
{testimonies.map((t, i) => (
  <GivingTestimonyCard
    key={t.name}
    testimony={t}
    rotate={i % 2 === 0 ? "-rotate-3" : "rotate-3"}
  />
))}
</div>
</section>
) : null}

            <section className="py-stack-lg px-margin-mobile md:px-margin-desktop text-center bg-background">
                <div className="max-w-4xl mx-auto py-14 md:py-16 px-6 md:px-12 rounded-[2rem] bg-[#06070a] relative overflow-hidden">
                    <div className="vibe-mesh absolute inset-0"></div>
                    <div className="relative z-10">
                        <span className="font-label-md text-label-md uppercase tracking-[0.3em] text-white/80 mb-6 block">Still deciding?</span>
                        <h2 className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-white uppercase mb-6 tracking-tight">Ready to make a difference?</h2>
                        <p className="font-body-lg text-white/85 mb-10 max-w-2xl mx-auto">Join hundreds of others who are investing in the next phase of our journey. Your gift, regardless of size, makes a massive impact.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href={ONLINE_GIVE_URL} target="_blank" rel="noreferrer" className="inline-block rounded-2xl bg-amber text-[#1a0b00] px-12 py-4 font-headline-md text-2xl vibe-glow">GIVE NOW</a>
                        </div>
                    </div>
                </div>
            </section>
</main>

<SiteFooter />


    </div>
  );
}

export default GivingPage;
