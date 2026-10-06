"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { hasCoords, osmEmbedUrl, type Branch } from "@/lib/branches";
import type { FormEvent } from "react";

function ContactPage({ mainCampus }: { mainCampus: Branch | null }) {
  function sendContactMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const subjectValue = String(data.get("subject") || "General Inquiry").trim();
    const message = String(data.get("message") || "").trim();
    const to = mainCampus?.email;
    if (!to) return;
    const phoneLine = phone ? `\nPhone: ${phone}` : "";
    const subject = encodeURIComponent(subjectValue);
    const body = encodeURIComponent(
      `From: ${name}\nEmail: ${email}${phoneLine}\n\n${message}`,
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="bg-background text-on-background font-body-md selection:bg-secondary-container">


<SiteHeader />
<main className="pt-20">

<section className="relative box-border flex min-h-[calc(100svh-5rem)] h-auto lg:h-[calc(100dvh-5rem)] lg:max-h-[calc(100dvh-5rem)] items-center overflow-hidden border-b-4 border-primary bg-on-background px-margin-mobile py-8 text-background md:px-margin-desktop md:py-10">
<div className="halftone-bg pointer-events-none absolute inset-0 opacity-25"></div>
<div className="absolute top-0 right-0 h-full w-2/3 bg-gradient-to-l from-primary/25 to-transparent"></div>
<div className="relative z-10 grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-gutter">
<div className="lg:col-span-7">
<span className="mb-6 inline-block animate-bounce border-heavy bg-secondary-container px-4 py-1 font-label-md uppercase tracking-widest text-on-secondary-container motion-reduce:animate-none">Feel Free To Reach Out</span>
<h1 className="mb-4 font-display-lg text-[48px] uppercase leading-none text-primary-fixed-dim sm:text-[64px] md:text-display-lg">
                    CONTACT US
                </h1>
<p className="mb-8 max-w-xl font-headline-md text-headline-md text-surface-container-low">
                    We are here for you. Whether you have a question, a prayer request, or just want to say hi.
                </p>
<div className="flex gap-4">
<div className="h-2 w-12 bg-secondary-container"></div>
<div className="h-2 w-12 bg-primary"></div>
<div className="h-2 w-12 bg-on-background"></div>
</div>
</div>
<div className="lg:col-span-5">
<div className="flex w-full flex-row gap-3 sm:gap-4 lg:ml-auto lg:w-[min(100%,calc((100dvh-10rem)/2))] lg:flex-col">
<div className="relative aspect-square flex-1 overflow-hidden rounded-none border-2 border-black brutalist-shadow">
<img alt="Worship on stage at Kharis" className="absolute inset-x-0 top-0 h-[200%] w-full max-w-none object-cover object-top" src="/assets/worship.jpg" loading="eager" decoding="async"/>
</div>
<div className="relative aspect-square flex-1 overflow-hidden rounded-none border-2 border-black brutalist-shadow">
<img alt="Congregation gathered in the auditorium" className="absolute inset-x-0 bottom-0 h-[200%] w-full max-w-none object-cover object-bottom" src="/assets/worship.jpg" loading="eager" decoding="async"/>
</div>
</div>
</div>
</div>
</section>


<section className="relative z-10 px-margin-mobile md:px-margin-desktop py-stack-lg grid grid-cols-1 md:grid-cols-12 gap-gutter">

<div className="md:col-span-7">
<div className="brutalist-border bg-white p-8 brutalist-shadow-lg relative overflow-hidden">
<div className="absolute top-0 right-0 w-24 h-24 halftone-bg -mr-12 -mt-12"></div>
<h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-8 uppercase border-b-2 border-on-background pb-4">
                        Send a Message
                    </h2>
<form className="space-y-6" onSubmit={sendContactMessage}>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="flex flex-col gap-2">
<label className="font-label-md uppercase">Your Name</label>
<input className="rounded-none brutalist-border p-4 font-body-md bg-background text-on-surface input-focus" placeholder="John Doe" type="text" name="name" autoComplete="name" />
</div>
<div className="flex flex-col gap-2">
<label className="font-label-md uppercase">Email Address</label>
<input className="rounded-none brutalist-border p-4 font-body-md bg-background text-on-surface input-focus" placeholder="hello@example.com" type="email" name="email" autoComplete="email" />
</div>
</div>
<div className="flex flex-col gap-2">
<label className="font-label-md uppercase">Phone</label>
<input className="rounded-none brutalist-border p-4 font-body-md bg-background text-on-surface input-focus" placeholder="+44 20 0000 0000" type="tel" name="phone" autoComplete="tel" inputMode="tel" />
</div>
<div className="flex flex-col gap-2">
<label className="font-label-md uppercase">Subject</label>
<select name="subject" className="rounded-none brutalist-border p-4 font-body-md bg-background text-on-surface input-focus appearance-none">
<option>General Inquiry</option>
<option>Prayer Request</option>
<option>Join a Team</option>
<option>Youth Ministry</option>
<option>Giving</option>
</select>
</div>
<div className="flex flex-col gap-2">
<label className="font-label-md uppercase">Message</label>
<textarea className="rounded-none brutalist-border p-4 font-body-md bg-background text-on-surface input-focus resize-none" placeholder="How can we help?" rows={5} name="message"></textarea>
</div>
<button className="w-full md:w-auto px-12 py-5 bg-primary text-on-primary font-headline-md text-2xl brutalist-border brutalist-shadow btn-hover transition-all uppercase" type="submit">
                            Send It!
                        </button>
</form>
</div>
</div>

<div className="md:col-span-5 space-y-gutter">

<div className="brutalist-border brutalist-shadow overflow-hidden aspect-square md:aspect-video relative">
<img alt="Community gathering at Kharis" className="w-full h-full object-cover" src="/assets/community.jpg" loading="lazy" decoding="async"/>
<div className="absolute bottom-4 left-4 bg-secondary-container px-4 py-2 brutalist-border font-label-md">
                        #KHARISFAMILY
                    </div>
</div>

<div className="brutalist-border bg-surface-container-low p-6 brutalist-shadow">
<h3 className="font-headline-md text-headline-md mb-4 uppercase">Church Hub</h3>
<div className="space-y-4">
<div className="flex items-start gap-4">
<span className="material-symbols-outlined text-primary text-3xl">location_on</span>
<div>
<p className="font-label-md uppercase text-secondary">Main Campus</p>
<p className="font-body-lg">{mainCampus?.address ?? "Find a KP2 campus near you"}</p>
</div>
</div>
<div className="flex items-start gap-4">
<span className="material-symbols-outlined text-primary text-3xl">schedule</span>
<div>
<p className="font-label-md uppercase text-secondary">Service Times</p>
{mainCampus?.serviceTimes.length ? (
  mainCampus.serviceTimes.map((s) => (
    <p key={`${s.day}-${s.time}`} className="font-body-lg">{s.day}: {s.time}{s.label ? ` (${s.label})` : ""}</p>
  ))
) : (
  <>
    <p className="font-body-lg">Sunday gatherings — times on each campus page</p>
  </>
)}
</div>
</div>
<div className="flex items-start gap-4">
<span className="material-symbols-outlined text-primary text-3xl">phone</span>
<div>
<p className="font-label-md uppercase text-secondary">Call Us</p>
<p className="font-body-lg">{mainCampus?.phone || "See your campus page"}</p>
</div>
</div>
</div>
</div>

{mainCampus && hasCoords(mainCampus) ? (
<div className="brutalist-border brutalist-shadow-lg overflow-hidden bg-surface-container-low">
<div className="flex items-center justify-between gap-4 border-b-2 border-on-background px-4 py-3">
<span className="font-label-md uppercase flex items-center gap-2">
<span className="material-symbols-outlined text-primary">place</span>
Find Us Here
</span>
<a
className="font-label-sm uppercase underline decoration-2 underline-offset-4 hover:text-primary"
href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mainCampus.address)}`}
target="_blank"
rel="noreferrer noopener"
>
Get Directions
</a>
</div>
<iframe
title="Map of Kharis Phase 2 campus"
src={osmEmbedUrl(mainCampus)}
className="w-full h-72 md:h-80 block border-0"
loading="lazy"
></iframe>
</div>
) : (
<Link href="/branches" className="block brutalist-border brutalist-shadow bg-surface-container-low p-6 font-label-md uppercase text-center hover:text-primary">
Find a campus
</Link>
)}

</div>
</section>

<section className="relative z-10 bg-secondary-container border-y-4 border-on-background py-16 px-margin-mobile md:px-margin-desktop">
<div className="flex flex-col md:flex-row items-center justify-between gap-gutter">
<h2 className="font-display-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-secondary-container">
                    Follow the Vibe
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link className="p-4 bg-white text-on-background rounded-none brutalist-border brutalist-shadow btn-hover transition-all flex items-center gap-2 shrink-0" href="/#app-stores">
                        <span className="material-symbols-outlined">smartphone</span>
                        <span className="font-label-md">KHARIS APP</span>
                    </Link>
                    <a className="p-4 bg-white text-on-background rounded-none brutalist-border brutalist-shadow btn-hover transition-all flex items-center gap-2 shrink-0" href="https://instagram.com/kharisphasetwo" target="_blank" rel="noreferrer">
                        <span className="material-symbols-outlined">public</span>
                        <span className="font-label-md">INSTAGRAM</span>
                    </a>
                    <a className="p-4 bg-white text-on-background rounded-none brutalist-border brutalist-shadow btn-hover transition-all flex items-center gap-2 shrink-0" href="https://youtube.com/@davidantwi" target="_blank" rel="noreferrer">
                        <span className="material-symbols-outlined">video_library</span>
                        <span className="font-label-md">YOUTUBE</span>
                    </a>
                </div>
</div>
</section>
</main>

<SiteFooter />


      <ThemeToggle />
    </div>
  );
}

export default ContactPage;
