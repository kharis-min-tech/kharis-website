"use client";

import { KP2_PHOTOS } from "@/lib/photography";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BANK, ONLINE_GIVE_URL, SMS_GIVE } from "@/lib/giving";
import { SPURGEONS_CENTRE } from "@/lib/spurgeons";
import type { GivingTestimony } from "@/lib/testimonies";
import { TestimoniesBand } from "@/components/TestimoniesBand";
import { ParallaxHeroImage } from "@/components/ParallaxHeroImage";
import { TypedText } from "@/components/TypedText";

function GivingPage({ testimonies }: { testimonies: GivingTestimony[] }) {
  return (
    <div className="bg-background text-on-background font-body-md selection:bg-secondary-container selection:text-on-secondary-container">
      <SiteHeader />
      <main className="pt-[74px]">
        <section className="relative box-border h-[calc(100svh-74px)] max-h-[calc(100svh-74px)] flex items-center justify-center bg-black overflow-hidden px-margin-mobile md:px-margin-desktop py-8">
          <ParallaxHeroImage
            src={KP2_PHOTOS.outreachTeam.src}
            alt={KP2_PHOTOS.outreachTeam.alt}
            className="object-center opacity-40"
          />

          <div className="absolute inset-0 halftone-pattern text-primary/20 pointer-events-none"></div>
          <div className="relative z-10 text-center max-w-4xl">
            <div className="inline-block bg-secondary-container text-on-secondary-container px-4 py-1 brutalist-border font-label-md text-label-md uppercase mb-6">
              Passionate for God and His Word
            </div>
            <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-white mb-4 md:mb-8 tracking-tighter uppercase">
              <TypedText text="Your Generosity" />
              <br />
              <TypedText text="Powers the Mission" delay={1200} className="text-secondary-fixed" />
            </h1>
            <p className="font-body-lg text-body-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Giving tithes and offerings are biblical principles and part of our worship. In most
              of our services, we give everyone the opportunity to give. &lsquo;He who sows
              sparingly will also reap sparingly, and he who sows bountifully will also reap
              bountifully&rsquo; – 2 Corinthians 9:6.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-stretch sm:items-center">
              <a
                href="#ways"
                className="kp-depth-button kp-button-gold inline-flex items-center justify-center gap-2 bg-[#f7be1d] text-[#151218] px-8 py-4 font-label-comic text-lg uppercase border-4 border-[#151218] brutalist-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
              >
                Give to your branch
              </a>
              <a
                href="#building"
                className="kp-depth-button kp-button-light keep-light inline-flex items-center justify-center gap-2 bg-white text-[#4c08a8] px-8 py-4 font-label-comic text-lg uppercase border-4 border-[#151218] brutalist-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
              >
                Build Spurgeon&apos;s Centre
              </a>
            </div>
          </div>
        </section>

        <section className="bg-background py-stack-lg px-margin-mobile md:px-margin-desktop">
          <div className="mx-auto max-w-7xl">
            <div className="mb-stack-lg max-w-3xl">
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase mb-4">
                Why We Give
              </h2>
              <div className="h-2 w-32 bg-primary brutalist-border mb-4"></div>
              <blockquote className="font-body-lg text-body-lg text-on-surface leading-relaxed mb-3">
                &ldquo;Whoever sows sparingly will also reap sparingly, and whoever sows generously
                will also reap generously.&rdquo;
              </blockquote>
              <p className="font-label-md uppercase tracking-widest text-primary">
                2 Corinthians 9:6
              </p>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-4">
                Giving is worship. We sow because God gave first — and every seed fuels the mission
                of Kharis.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="bg-surface-container-low brutalist-border p-8 neo-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 halftone-pattern w-32 h-32 text-primary opacity-20"></div>
                <span className="material-symbols-outlined text-primary text-5xl mb-4">
                  volunteer_activism
                </span>
                <h3 className="font-headline-md text-headline-md uppercase mb-4">
                  Worship &amp; Obedience
                </h3>
                <p className="text-on-surface-variant font-body-md">
                  We give because God gave first. Our offerings are a response to His grace and a
                  step of faith.
                </p>
              </div>

              <div className="bg-secondary-container brutalist-border p-8 neo-shadow relative group">
                <span className="material-symbols-outlined text-on-secondary-container text-5xl mb-4">
                  favorite
                </span>
                <h3 className="font-headline-md text-headline-md uppercase mb-4">
                  Care for People
                </h3>
                <p className="text-on-secondary-container font-body-md">
                  Generosity meets real needs in our community — from food support to mentorship and
                  crisis relief.
                </p>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
              </div>

              <div className="bg-white brutalist-border p-8 neo-shadow">
                <span className="material-symbols-outlined text-primary text-5xl mb-4">
                  groups_2
                </span>
                <h3 className="font-headline-md text-headline-md uppercase mb-4">
                  Build Community
                </h3>
                <p className="text-on-surface-variant font-body-md">
                  Every gift helps create spaces where people can belong, grow, and discover their
                  purpose.
                </p>
              </div>

              <div className="bg-surface-container-highest brutalist-border p-8 neo-shadow flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-primary text-5xl mb-4">
                    auto_awesome
                  </span>
                  <h3 className="font-headline-md text-headline-md uppercase mb-4">
                    Advance the Mission
                  </h3>
                  <p className="text-on-surface-variant font-body-md mb-6">
                    From local outreach to media and new branches, giving sends the message of
                    Kharis further.
                  </p>
                </div>
                <Link
                  href="/mission"
                  className="text-primary font-label-md uppercase flex items-center gap-2 group-hover:translate-x-2 transition-transform"
                >
                  Learn more <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          id="ways"
          className="py-stack-lg bg-surface-container-low px-margin-mobile md:px-margin-desktop"
        >
          <div className="max-w-7xl mx-auto text-center mb-stack-lg">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase mb-4">
              Ways to Give
            </h2>
            <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Choose the method that is most convenient for you. All transactions are securely
              encrypted.
            </p>
          </div>
          <div className="grid grid-cols-1 items-stretch gap-gutter max-w-7xl mx-auto md:grid-cols-2">
            <div
              data-giving-method="online"
              className="flex min-w-0 flex-col border-4 border-black bg-[#f7be1d] p-6 text-[#151218] md:p-10"
            >
              <div className="mb-6 flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/40">
                <span className="material-symbols-outlined text-4xl" aria-hidden="true">
                  credit_card
                </span>
              </div>
              <h3 className="mb-6 font-headline-md text-headline-md uppercase">Give Online</h3>
              <p className="flex-1 font-body-md">
                Give to your branch by card, once or every month, through the secure Kharis giving
                portal.
              </p>
              <a
                href={ONLINE_GIVE_URL}
                target="_blank"
                rel="noreferrer"
                className="kp-depth-button kp-button-purple mt-6 w-full border-4 border-[#151218] bg-primary px-10 py-3 text-center font-label-md uppercase tracking-widest text-on-primary brutalist-shadow sm:w-auto sm:self-start"
              >
                Give now
              </a>
            </div>

            <div
              data-giving-method="bank"
              className="flex min-w-0 flex-col border-4 border-black bg-white p-6 md:p-10"
            >
              <div className="mb-6 flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <span
                  className="material-symbols-outlined text-4xl text-primary"
                  aria-hidden="true"
                >
                  account_balance
                </span>
              </div>
              <h3 className="mb-6 font-headline-md text-headline-md uppercase">Bank Transfer</h3>
              <div
                className="w-full flex-1 space-y-2 border-2 border-black bg-surface-container-high p-4 text-left font-label-sm [overflow-wrap:anywhere]"
                id="bank-details"
              >
                <p>
                  <span className="font-bold">Account Name:</span> {BANK.accountName}
                </p>
                <p>
                  <span className="font-bold">Account Number:</span> {BANK.accountNumber}
                </p>
                <p>
                  <span className="font-bold">Sort Code:</span> {BANK.sortCode}
                </p>
                <p>
                  <span className="font-bold">SWIFT/BIC:</span> {BANK.swift}
                </p>
                <p>
                  <span className="font-bold">IBAN:</span> {BANK.iban}
                </p>
              </div>
            </div>

            <div
              data-giving-method="text"
              className="flex min-w-0 flex-col border-4 border-black bg-white p-6 md:p-10"
            >
              <div className="mb-6 flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <span
                  className="material-symbols-outlined text-4xl text-primary"
                  aria-hidden="true"
                >
                  sms
                </span>
              </div>
              <h3 className="mb-6 font-headline-md text-headline-md uppercase">
                Text Giving (UK Only)
              </h3>
              <p className="mb-4 font-body-lg text-on-surface">
                Text <span className="font-bold">{SMS_GIVE.keyword} [Amount]</span> to{" "}
                <span className="font-bold">{SMS_GIVE.number}</span> (e.g. {SMS_GIVE.keyword} 5).
              </p>
              <p className="font-body-md text-on-surface-variant">
                NB: You can give up to £20. Giving will be added to your next phone bill or taken
                from your pay as you go balance.
              </p>
            </div>

            <div
              data-giving-method="app"
              className="flex min-w-0 flex-col border-4 border-black bg-primary p-6 text-on-primary md:p-10"
            >
              <div className="mb-6 flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/10">
                <span className="material-symbols-outlined text-4xl text-white" aria-hidden="true">
                  smartphone
                </span>
              </div>
              <h3 className="mb-6 font-headline-md text-headline-md uppercase">Mobile App</h3>
              <p className="flex-1 font-body-md text-on-primary/90">
                Download the Kharis Hub app. Manage recurring giving and track your history easily.
              </p>
              <Link
                href="/#app-stores"
                className="mt-6 w-full border-4 border-black bg-white px-10 py-3 text-center font-label-md uppercase tracking-widest text-primary neo-shadow transition-colors hover:bg-surface-variant sm:w-auto sm:self-start"
              >
                GET THE APP
              </Link>
            </div>
          </div>
        </section>

        <section
          id="building"
          className="kp-build bg-[#151218] text-white border-y-4 border-black px-margin-mobile md:px-margin-desktop py-stack-lg"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <figure className="relative">
              <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#f7be1d] border-4 border-black" />
              <img
                src={SPURGEONS_CENTRE.image}
                alt="An artist's impression of the renovated Spurgeon's Centre in South London"
                loading="lazy"
                decoding="async"
                className="relative block w-full aspect-[4/3] object-cover border-4 border-black"
              />
              <span className="absolute -top-4 left-4 bg-primary text-white border-2 border-black font-label-sm uppercase px-3 py-1 -rotate-2">
                Building fund
              </span>
            </figure>
            <div>
              <h2 className="font-display-lg text-headline-lg-mobile md:text-display-lg uppercase leading-none tracking-tight mb-6">
                We&rsquo;ve purchased <span className="text-[#f7be1d]">our new home</span>
              </h2>
              <div className="font-body-lg text-body-lg text-white/85 max-w-xl mb-8 space-y-4">
                <p>
                  We are excited to announce that we have officially acquired our own facility that
                  was formerly Spurgeon&rsquo;s College.
                </p>
                <p>
                  Now begins the exciting work restoring and developing this facility into a home
                  for advancing the gospel.
                </p>
                <p>
                  If you would like to partner with us and give towards this project, you can do so
                  using the link below.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <a
                  href={SPURGEONS_CENTRE.giveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kp-depth-button kp-button-gold inline-flex items-center justify-center bg-[#f7be1d] text-[#151218] px-8 py-4 font-label-comic text-base uppercase border-4 border-black brutalist-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
                >
                  Give to the building
                </a>
                <a
                  href={SPURGEONS_CENTRE.pledgeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kp-depth-button kp-button-light keep-light inline-flex items-center justify-center bg-white text-[#4c08a8] px-8 py-4 font-label-comic text-base uppercase border-4 border-black brutalist-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
                >
                  Make a pledge
                </a>
              </div>
              <a
                href={SPURGEONS_CENTRE.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-label-md uppercase text-white/80 underline underline-offset-4 hover:text-[#f7be1d]"
              >
                See the project at spurgeonscentre.org
                <span className="material-symbols-outlined text-base" aria-hidden="true">
                  open_in_new
                </span>
              </a>
            </div>
          </div>
        </section>

        {testimonies.length > 0 ? (
          <TestimoniesBand
            id="living-testimonies"
            eyebrow="Stories"
            title="Living Testimonies"
            intro="Real testimonies from the Kharis family."
            items={testimonies.map((t) => ({ quote: t.quote, name: t.name, meta: t.role }))}
          />
        ) : null}

        <section className="py-stack-lg px-margin-mobile md:px-margin-desktop text-center bg-white border-t-2 border-black">
          <div className="max-w-4xl mx-auto py-10 md:py-12 px-6 md:px-12 kp-brand-panel brutalist-shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full"></div>
              <div className="absolute top-1/3 -right-20 w-72 h-72 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-black/10 rounded-full"></div>
              <div className="absolute top-8 left-1/4 w-40 h-40 border-2 border-white/10 rounded-full"></div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 border-2 border-white/10 rounded-full"></div>
            </div>
            <div className="relative z-10">
              <img
                src="/kp2/assets/kharis-logo.png"
                alt=""
                aria-hidden="true"
                className="kp-panel-dove"
              />
              <span className="font-label-md text-label-md uppercase tracking-[0.3em] text-white/80 mb-6 block">
                Still deciding?
              </span>
              <h2 className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-white uppercase mb-6 tracking-tight">
                Ready to make a difference?
              </h2>
              <p className="font-body-lg text-white/85 mb-10 max-w-2xl mx-auto">
                Join hundreds of others who are investing in the next phase of our journey. Your
                gift, regardless of size, makes a massive impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  data-ui="open-dialog"
                  data-dialog="give-online-dialog"
                  className="kp-depth-button kp-button-light inline-block rounded-none bg-white text-[#4c08a8] px-12 py-4 font-headline-md text-2xl hover:scale-105 hover:bg-gray-100 transition-all shadow-lg"
                >
                  GIVE NOW
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <dialog
        id="give-online-dialog"
        className="ui-dialog max-w-lg w-[calc(100%-2rem)] border-4 border-black bg-white p-0 text-on-background"
      >
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-headline-md text-headline-md uppercase">Give Online</h2>
            <button
              type="button"
              data-ui="close-dialog"
              className="w-10 h-10 border-2 border-black flex items-center justify-center"
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <p className="font-body-md text-on-surface-variant">
            Give through the Kharis portal, by SMS, or by bank transfer. Every gift supports the
            mission.
          </p>
          <a
            href={ONLINE_GIVE_URL}
            target="_blank"
            rel="noreferrer"
            className="kp-depth-button kp-button-purple block w-full bg-primary text-on-primary text-center py-3 font-label-md uppercase border-2 border-black"
          >
            Continue to Kharis Giving
          </a>
          <div className="border-2 border-black p-4 space-y-1 font-label-sm text-left">
            <p className="font-headline-md uppercase mb-2">SMS</p>
            <p>
              Text <strong>{SMS_GIVE.keyword} [Amount]</strong> to{" "}
              <strong>{SMS_GIVE.number}</strong>
            </p>
          </div>
          <div className="border-2 border-black p-4 space-y-1 font-label-sm text-left">
            <p className="font-headline-md uppercase mb-2">Bank details</p>
            <p>
              <span className="font-bold">Account name:</span> {BANK.accountName}
            </p>
            <p>
              <span className="font-bold">Account number:</span> {BANK.accountNumber}
            </p>
            <p>
              <span className="font-bold">Sort code:</span> {BANK.sortCode}
            </p>
            <p>
              <span className="font-bold">SWIFT:</span> {BANK.swift}
            </p>
            <p>
              <span className="font-bold">IBAN:</span> {BANK.iban}
            </p>
          </div>
          <Link
            href="/#app-stores"
            className="block w-full text-center py-3 font-label-md uppercase border-2 border-black"
          >
            Give in the app
          </Link>
        </div>
      </dialog>

      <SiteFooter />

      <ThemeToggle />
    </div>
  );
}

export default GivingPage;
