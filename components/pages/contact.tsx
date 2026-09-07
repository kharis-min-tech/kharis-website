"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { hasCoords, osmEmbedUrl, type Branch } from "@/lib/branches";

function ContactPage({ mainCampus }: { mainCampus: Branch | null }) {
  return (
    <div className="bg-background text-on-background font-body-md selection:bg-secondary-container">


<SiteHeader />
<main className="pt-20">

<section className="relative bg-[#06070a] text-white py-24 md:py-32 px-margin-mobile md:px-margin-desktop overflow-hidden">
<div className="vibe-mesh absolute inset-0"></div>
<div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-transparent to-transparent"></div>
<div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
<div className="lg:col-span-7">
<span className="inline-block rounded-full bg-amber text-[#1a0b00] font-label-md px-4 py-1 mb-6 uppercase tracking-widest">Feel Free To Reach Out</span>
<h1 className="font-display-lg text-[64px] md:text-display-lg text-primary-fixed-dim uppercase leading-none mb-4">
                    CONTACT US
                </h1>
<p className="font-headline-md text-headline-md text-surface-container-low mb-8 max-w-xl">
                    We are here for you. Whether you have a question, a prayer request, or just want to say hi.
                </p>
<div className="flex gap-4">
<div className="w-12 h-2 rounded-full bg-secondary-container"></div>
<div className="w-12 h-2 rounded-full bg-primary"></div>
<div className="w-12 h-2 rounded-full bg-on-background"></div>
</div>
</div>
<div className="lg:col-span-5">
<div className="rounded-3xl vibe-glow overflow-hidden hover-card">
<img alt="Kharis congregation worshipping together" className="w-full h-64 lg:h-80 object-cover" src="/assets/worship.jpg" loading="eager" decoding="async"/>
</div>
</div>
</div>
</section>


<section className="relative z-10 px-margin-mobile md:px-margin-desktop py-stack-lg grid grid-cols-1 md:grid-cols-12 gap-gutter">

<div className="md:col-span-7">
<div className="rounded-2xl border border-on-background/10 bg-surface-container-lowest p-8 vibe-card relative overflow-hidden">
<h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-8 uppercase border-b border-on-background/10 pb-4">
                        Send a Message
                    </h2>
<form className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="flex flex-col gap-2">
<label className="font-label-md uppercase">Your Name</label>
<input className="rounded-2xl border border-on-background/10 p-4 font-body-md input-focus" placeholder="John Doe" type="text" />
</div>
<div className="flex flex-col gap-2">
<label className="font-label-md uppercase">Email Address</label>
<input className="rounded-2xl border border-on-background/10 p-4 font-body-md input-focus" placeholder="hello@example.com" type="email" />
</div>
</div>
<div className="flex flex-col gap-2">
<label className="font-label-md uppercase">Subject</label>
<select className="rounded-2xl border border-on-background/10 p-4 font-body-md input-focus appearance-none bg-surface-container-lowest">
<option>General Inquiry</option>
<option>Prayer Request</option>
<option>Join a Team</option>
<option>Youth Ministry</option>
<option>Giving</option>
</select>
</div>
<div className="flex flex-col gap-2">
<label className="font-label-md uppercase">Message</label>
<textarea className="rounded-2xl border border-on-background/10 p-4 font-body-md input-focus resize-none" placeholder="How can we help?" rows={5}></textarea>
</div>
<button className="w-full md:w-auto px-12 py-5 bg-primary text-on-primary font-headline-md text-2xl rounded-2xl vibe-glow btn-hover transition-all uppercase" type="submit">
                            Send It!
                        </button>
</form>
</div>
</div>

<div className="md:col-span-5 space-y-gutter">

<div className="rounded-2xl vibe-glow overflow-hidden aspect-square md:aspect-video relative">
<img alt="Community gathering at Kharis" className="w-full h-full object-cover" src="/assets/community.jpg" loading="lazy" decoding="async"/>
<div className="absolute bottom-4 left-4 bg-secondary-container px-4 py-2 rounded-2xl border border-on-background/10 font-label-md">
                        #KHARISFAMILY
                    </div>
</div>

<div className="rounded-2xl border border-on-background/10 bg-surface-container-low p-6 brutalist-shadow">
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
<div className="rounded-3xl vibe-glow overflow-hidden bg-surface-container-low">
<div className="flex items-center justify-between gap-4 border-b border-on-background/10 px-4 py-3">
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
<Link href="/branches" className="block rounded-2xl vibe-glow bg-surface-container-low p-6 font-label-md uppercase text-center hover:text-primary">
Find a campus
</Link>
)}

</div>
</section>

<section className="relative z-10 bg-secondary-container py-16 px-margin-mobile md:px-margin-desktop">
<div className="flex flex-col md:flex-row items-center justify-between gap-gutter">
<h2 className="font-display-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-secondary-container">
                    Follow the Vibe
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                    <a className="p-4 bg-white rounded-2xl vibe-glow btn-hover transition-all flex items-center gap-2" href="https://instagram.com/kharisphasetwo" target="_blank" rel="noreferrer">
                        <span className="material-symbols-outlined">public</span>
                        <span className="font-label-md">INSTAGRAM</span>
                    </a>
                    <a className="p-4 bg-white rounded-2xl vibe-glow btn-hover transition-all flex items-center gap-2" href="https://youtube.com/@davidantwi" target="_blank" rel="noreferrer">
                        <span className="material-symbols-outlined">video_library</span>
                        <span className="font-label-md">YOUTUBE</span>
                    </a>
                </div>
</div>
</section>
</main>

<SiteFooter />


    </div>
  );
}

export default ContactPage;
