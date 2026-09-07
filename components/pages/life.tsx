"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import type { ChurchEvent } from "@/lib/events";
import { eventToCalendarItem } from "@/lib/calendar";
import { PlanVisitButton } from "@/components/PlanVisitButton";
import { LotGallery } from "@/components/LotGallery";
import type { InstagramPost } from "@/lib/instagram";

function socialDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    timeZone: "Europe/London",
  });
}

function socialBlurb(text: string) {
  const clean = text.trim();
  if (clean.length <= 90) return clean;
  return `${clean.slice(0, 90).replace(/\s+\S*$/, "").trim()}…`;
}

function LifePage({
  upcoming,
  instagram,
}: {
  upcoming: ChurchEvent[];
  instagram: InstagramPost[];
}) {
  return (
    <div className="bg-background text-on-background font-body-md selection:bg-secondary-container selection:text-on-secondary-container">
      <SiteHeader />

      <header className="relative min-h-[100svh] flex items-end md:items-center pt-24 overflow-hidden bg-[#06070a] text-white">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          src="/assets/crowd.mp4"
        />
        <div className="vibe-mesh absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-[#06070a]/50 to-transparent" />

        <div className="relative z-10 px-margin-mobile md:px-margin-desktop w-full max-w-7xl mx-auto flex flex-col items-start gap-5 pb-12 md:pb-20">
          <div className="rounded-full bg-amber text-[#1a0b00] px-4 py-1.5 font-label-md text-[11px] uppercase tracking-[0.2em]">Lifestyle</div>
          <h1 className="font-display-lg text-[42px] sm:text-5xl md:text-display-lg max-w-4xl leading-[0.95] tracking-tighter uppercase">
            This isn&apos;t just a church.<br/>
            <span className="bg-gradient-to-r from-amber via-magenta to-[#d2bbff] bg-clip-text text-transparent">It&apos;s a movement.</span>
          </h1>
          <p className="font-body-lg text-[15px] sm:text-body-lg max-w-2xl text-white/80">
            High-energy community where faith meets culture. Young, bold, and driven to transform the world through love and creativity.
          </p>
          <div className="flex w-full max-w-md flex-col sm:flex-row sm:max-w-none gap-3 mt-4">
            <Link
              href="/branches"
              className="rounded-2xl bg-amber text-[#1a0b00] px-8 py-4 font-headline-md text-lg uppercase text-center vibe-glow"
            >
              Find your branch
            </Link>
            <a
              href="#the-lot"
              className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-headline-md text-lg uppercase text-center backdrop-blur-md"
            >
              See the lot
            </a>
          </div>
        </div>
      </header>

      <LotGallery instagram={instagram} kicker="Kharis Life" heading="The lot" />

      <main className="relative z-20">
        {/* Fellowship section removed */}


        <section className="py-stack-lg px-margin-desktop max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber/30 rounded-full -z-10 blur-2xl"></div>
                <div className="rounded-3xl bg-surface-container-lowest vibe-card p-8 relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-primary" style={{fontVariationSettings: "'FILL' 1"}}>event</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md uppercase">Upcoming Socials</h3>
                  </div>
                  <ul className="space-y-6">
                    {upcoming.length === 0 ? (
                      <li className="font-body-md text-on-surface-variant">
                        No upcoming events just yet — check the events page for the latest.
                      </li>
                    ) : (
                      upcoming.map((event, i) => (
                        <li key={event.slug} className="flex gap-4 items-start group">
                          <div className="font-label-md text-label-md text-primary w-14 pt-1 uppercase shrink-0">
                            {socialDate(event.starts)}
                          </div>
                          <div className={`flex-1 ${i > 0 ? "border-t-2 border-outline-variant pt-4" : ""}`}>
                            <h4 className="font-body-lg text-body-lg font-bold group-hover:text-primary transition-colors">
                              <Link href="/events">{event.title}</Link>
                            </h4>
                            <p className="font-body-md text-body-md text-on-surface-variant">
                              {socialBlurb(event.blurb)}
                            </p>
                            <PlanVisitButton
                              item={eventToCalendarItem(event)}
                              className="mt-2 inline-flex items-center gap-1 font-label-md text-[11px] uppercase tracking-widest text-primary"
                            >
                              <span className="material-symbols-outlined text-base">
                                calendar_add_on
                              </span>
                              Remind me
                            </PlanVisitButton>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                  <Link
                    href="/events"
                    className="block w-full mt-10 rounded-2xl bg-primary text-on-primary py-4 vibe-glow font-headline-md text-headline-md uppercase text-center"
                  >
                    See More
                  </Link>
                </div>
              </div>
            </div>
            <div className="md:col-span-7 order-1 md:order-2">
              <div className="p-8">
                <div className="inline-block rounded-full bg-amber text-[#1a0b00] px-3 py-1 font-label-md text-label-md uppercase mb-6">Stay Connected</div>
                <h2 className="font-display-lg text-headline-lg uppercase leading-[0.9] mb-8">Follow the <br/><span className="text-primary italic">Movement</span> online</h2>
                <p className="font-body-lg text-body-lg text-on-surface mb-8">Get daily inspiration, community highlights, and real-time event updates. We’re building a kingdom culture that doesn't stop when the Sunday service ends.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a className="flex items-center gap-3 rounded-2xl border border-on-background/10 p-4 bg-surface-container-lowest hover:bg-amber hover:text-[#1a0b00] transition-colors vibe-card group" href="https://instagram.com/kharisphasetwo" target="_blank" rel="noreferrer">
                    <span className="material-symbols-outlined text-4xl shrink-0">photo_camera</span>
                    <div className="min-w-0">
                      <p className="font-label-md text-label-md uppercase">Instagram</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-secondary-container break-all">@kharisphasetwo</p>
                    </div>
                  </a>
                  <a className="flex items-center gap-3 rounded-2xl border border-on-background/10 p-4 bg-surface-container-lowest hover:bg-primary hover:text-on-primary transition-colors vibe-card group" href="https://youtube.com/@davidantwi" target="_blank" rel="noreferrer">
                    <span className="material-symbols-outlined text-4xl shrink-0">video_library</span>
                    <div className="min-w-0">
                      <p className="font-label-md text-label-md uppercase">YouTube</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-white/80 break-all">@davidantwi</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#06070a] py-20 relative overflow-hidden">
          <div className="vibe-mesh absolute inset-0"></div>
          <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10">
            <h2 className="font-display-lg text-headline-lg text-white uppercase mb-4">Don't Miss a beat.</h2>
            <p className="text-white/70 font-body-lg text-body-lg mb-10">Sign up for our weekly 'Life Update' and never miss out on a social or small group gathering.</p>
            <form className="flex flex-col md:flex-row gap-4">
              <input className="flex-1 px-6 py-4 rounded-2xl border border-white/15 font-label-md text-label-md focus:outline-none bg-white/10 text-white placeholder:text-white/50" placeholder="YOUR EMAIL ADDRESS" type="email"/>
              <button className="rounded-2xl bg-amber text-[#1a0b00] px-10 py-4 font-headline-md text-headline-md uppercase vibe-glow">Subscribe Now</button>
            </form>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default LifePage;
