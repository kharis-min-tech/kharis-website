"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";



function MessagesPage() {
  return (
    <div className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">


<SiteHeader />
<main className="pt-20">

<section className="relative w-full h-[819px] bg-on-background overflow-hidden border-b-4 border-black">
<div className="absolute inset-0 bg-cover bg-center opacity-60" data-alt="Preaching at Kharis" style={{backgroundImage: "url('/assets/pastor-stage.jpg')"}}></div>
<div className="absolute inset-0 hero-gradient"></div>
<div className="absolute inset-0 halftone-pattern text-white/5 pointer-events-none"></div>
<div className="relative z-10 h-full flex flex-col justify-end px-margin-desktop pb-16 max-w-7xl mx-auto">
<div className="inline-block bg-secondary-container text-on-secondary-container font-label-md px-4 py-1 border-2 border-black mb-6 uppercase">Latest Message</div>
<h1 className="font-display-lg text-display-lg text-white leading-none uppercase mb-4 tracking-tighter">The Sound of <span className="text-primary-container">Revival</span></h1>
<p className="font-body-lg text-body-lg text-surface-variant max-w-2xl mb-8">Join Pastor John Doe as we explore the prophetic significance of sound and spirit in this season. A message of hope, power, and the coming wave of faith.</p>
<div className="flex gap-4">
<button className="bg-primary text-white font-headline-md px-8 py-4 border-2 border-black hard-shadow flex items-center gap-3 btn-press group">
<span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>play_arrow</span>
                        WATCH NOW
                    </button>
<button className="bg-white text-black font-headline-md px-8 py-4 border-2 border-black hard-shadow flex items-center gap-3 btn-press">
<span className="material-symbols-outlined">share</span>
                        SHARE
                    </button>
</div>
</div>
</section>

<section className="max-w-7xl mx-auto px-margin-desktop py-16">
<div className="flex items-center gap-4 mb-8">
<div className="w-4 h-8 bg-primary"></div>
<h2 className="font-headline-md text-headline-md uppercase">Latest Message</h2>
</div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

<div className="lg:col-span-8 bg-surface border-2 border-black neo-shadow-lg overflow-hidden group">
<div className="aspect-video relative bg-black cursor-pointer">
<img alt="Senior Pastor preaching the latest message" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" src="/assets/pastor-stage.jpg" loading="lazy" decoding="async"/>
<div className="absolute inset-0 flex items-center justify-center">
<div className="bg-secondary-container p-6 rounded-full border-4 border-black neo-shadow group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-4xl leading-none text-on-background" style={{fontVariationSettings: "'FILL' 1"}}>play_arrow</span>
</div>
</div>
<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
<span className="bg-secondary text-on-secondary font-label-sm px-2 py-1 mb-2 inline-block border border-black">NEWEST RELEASE</span>
<h3 className="font-headline-md text-white text-2xl uppercase">The Gravity of Grace</h3>
</div>
</div>
</div>

<div className="lg:col-span-4 bg-surface-container border-2 border-black neo-shadow p-6 flex flex-col">
<h4 className="font-label-md text-primary mb-2">NOW PLAYING</h4>
<h3 className="font-headline-md text-3xl uppercase mb-4">The Gravity of Grace</h3>
<p className="font-body-md text-on-surface-variant mb-6">
  Dive deep into the transformative power of grace in our latest series. Understanding how grace anchors us in turbulent times.
</p>
<div className="space-y-3 mb-6">
<div className="flex items-center gap-3 font-label-sm text-on-surface">
<span className="material-symbols-outlined text-primary">calendar_today</span>
<span>Sunday, Oct 27, 2024</span>
</div>
<div className="flex items-center gap-3 font-label-sm text-on-surface">
<span className="material-symbols-outlined text-primary">person</span>
<span>Senior Pastor D. Antwi</span>
</div>
</div>
<div className="flex gap-4 mt-auto">
<button type="button" className="flex-1 bg-primary text-on-primary font-label-md py-3 border-2 border-black neo-shadow hover-press">SHARE VIDEO</button>
</div>
</div>
</div>
</section>


<section className="bg-surface-container-high border-b-2 border-black sticky top-20 z-40">
<div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-4 flex flex-wrap items-center justify-between gap-gutter">
<div className="flex flex-wrap gap-4 items-center">
<span className="font-label-md text-label-md uppercase flex items-center gap-2">
<span className="material-symbols-outlined text-primary">filter_list</span> Filter By:
                    </span>
<select className="bg-white border-2 border-black font-label-sm px-4 py-2 focus:ring-2 focus:ring-secondary-container outline-none appearance-none">
<option>SERIES</option>
<option>The Identity Series</option>
<option>Faith Foundations</option>
</select>
<select className="bg-white border-2 border-black font-label-sm px-4 py-2 focus:ring-2 focus:ring-secondary-container outline-none">
<option>SPEAKER</option>
<option>Rev. Michael Smith</option>
<option>Dr. Sarah Jenkins</option>
</select>
<select className="bg-white border-2 border-black font-label-sm px-4 py-2 focus:ring-2 focus:ring-secondary-container outline-none">
<option>TOPIC</option>
<option>Prayer</option>
<option>Finance</option>
<option>Relationship</option>
</select>
</div>
<div className="relative w-full md:w-64">
<input className="w-full bg-white border-2 border-black font-label-sm px-4 py-2 focus:ring-2 focus:ring-secondary-container outline-none" placeholder="SEARCH MESSAGES..." type="text"/>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary">search</span>
</div>
</div>
</section>

<section className="max-w-7xl mx-auto px-margin-desktop py-16">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

<div className="group border-2 border-black bg-white hard-shadow hover:translate-y-[-4px] transition-all">
<div className="relative aspect-video border-b-2 border-black overflow-hidden">
<div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" data-alt="Congregation in worship" style={{backgroundImage: "url('/assets/worship.jpg')"}}></div>
<div className="absolute bottom-2 right-2 bg-on-background text-white font-label-sm px-2 py-1 text-xs">48:20</div>
</div>
<div className="p-6">
<div className="flex gap-2 mb-3">
<span className="bg-secondary-container text-on-secondary-container text-[10px] font-label-md px-2 py-0.5 border border-black uppercase">Series: Foundations</span>
</div>
<h3 className="font-headline-md text-headline-md leading-tight mb-2 uppercase group-hover:text-primary transition-colors">The Power of Persistence</h3>
<p className="font-body-md text-body-md text-tertiary mb-4 line-clamp-2">Discover how to maintain your faith when the journey gets tough. Practical steps for spiritual endurance.</p>
<div className="flex items-center justify-between border-t-2 border-black/10 pt-4">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-full border border-black bg-surface-container-highest flex items-center justify-center text-xs font-label-md">PS</div>
<span className="font-label-sm text-xs uppercase">Pastor Sam</span>
</div>
<span className="font-label-sm text-[10px] text-outline uppercase">OCT 24, 2023</span>
</div>
</div>
</div>

<div className="group border-2 border-black bg-white hard-shadow hover:translate-y-[-4px] transition-all">
<div className="relative aspect-video border-b-2 border-black overflow-hidden">
<div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" data-alt="Choir at Sunday service" style={{backgroundImage: "url('/assets/events-sunday-service.jpg')"}}></div>
<div className="absolute bottom-2 right-2 bg-on-background text-white font-label-sm px-2 py-1 text-xs">52:15</div>
</div>
<div className="p-6">
<div className="flex gap-2 mb-3">
<span className="bg-secondary-container text-on-secondary-container text-[10px] font-label-md px-2 py-0.5 border border-black uppercase">Series: Sound of Kharis</span>
</div>
<h3 className="font-headline-md text-headline-md leading-tight mb-2 uppercase group-hover:text-primary transition-colors">Walking in Authority</h3>
<p className="font-body-md text-body-md text-tertiary mb-4 line-clamp-2">Understanding the spiritual jurisdiction given to every believer and how to activate it in daily life.</p>
<div className="flex items-center justify-between border-t-2 border-black/10 pt-4">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-full border border-black bg-surface-container-highest flex items-center justify-center text-xs font-label-md">DJ</div>
<span className="font-label-sm text-xs uppercase">Dr. Janet</span>
</div>
<span className="font-label-sm text-[10px] text-outline uppercase">OCT 17, 2023</span>
</div>
</div>
</div>

<div className="group border-2 border-black bg-white hard-shadow hover:translate-y-[-4px] transition-all">
<div className="relative aspect-video border-b-2 border-black overflow-hidden">
<div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" data-alt="Kharis auditorium" style={{backgroundImage: "url('/assets/branch-slide-3.jpg')"}}></div>
<div className="absolute bottom-2 right-2 bg-on-background text-white font-label-sm px-2 py-1 text-xs">45:00</div>
</div>
<div className="p-6">
<div className="flex gap-2 mb-3">
<span className="bg-secondary-container text-on-secondary-container text-[10px] font-label-md px-2 py-0.5 border border-black uppercase">Single Message</span>
</div>
<h3 className="font-headline-md text-headline-md leading-tight mb-2 uppercase group-hover:text-primary transition-colors">The Quiet Confidence</h3>
<p className="font-body-md text-body-md text-tertiary mb-4 line-clamp-2">Exploring the strength found in silence and the peace that surpasses all understanding.</p>
<div className="flex items-center justify-between border-t-2 border-black/10 pt-4">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-full border border-black bg-surface-container-highest flex items-center justify-center text-xs font-label-md">MK</div>
<span className="font-label-sm text-xs uppercase">Minister Ken</span>
</div>
<span className="font-label-sm text-[10px] text-outline uppercase">OCT 10, 2023</span>
</div>
</div>
</div>

<div className="group border-2 border-black bg-white hard-shadow hover:translate-y-[-4px] transition-all">
<div className="relative aspect-video border-b-2 border-black overflow-hidden">
<div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" data-alt="Youth ministry gathering" style={{backgroundImage: "url('/assets/young-adults.jpg')"}}></div>
<div className="absolute bottom-2 right-2 bg-on-background text-white font-label-sm px-2 py-1 text-xs">38:45</div>
</div>
<div className="p-6">
<div className="flex gap-2 mb-3">
<span className="bg-secondary-container text-on-secondary-container text-[10px] font-label-md px-2 py-0.5 border border-black uppercase">Series: Gen Next</span>
</div>
<h3 className="font-headline-md text-headline-md leading-tight mb-2 uppercase group-hover:text-primary transition-colors">Digital Discipleship</h3>
<p className="font-body-md text-body-md text-tertiary mb-4 line-clamp-2">How to live out your faith authentically in an increasingly digital and connected world.</p>
<div className="flex items-center justify-between border-t-2 border-black/10 pt-4">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-full border border-black bg-surface-container-highest flex items-center justify-center text-xs font-label-md">RB</div>
<span className="font-label-sm text-xs uppercase">Rev. Ben</span>
</div>
<span className="font-label-sm text-[10px] text-outline uppercase">OCT 03, 2023</span>
</div>
</div>
</div>

<div className="group border-2 border-black bg-white hard-shadow hover:translate-y-[-4px] transition-all">
<div className="relative aspect-video border-b-2 border-black overflow-hidden">
<div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" data-alt="Prayer at Thursday service" style={{backgroundImage: "url('/assets/events-thursday-service.jpg')"}}></div>
<div className="absolute bottom-2 right-2 bg-on-background text-white font-label-sm px-2 py-1 text-xs">55:10</div>
</div>
<div className="p-6">
<div className="flex gap-2 mb-3">
<span className="bg-secondary-container text-on-secondary-container text-[10px] font-label-md px-2 py-0.5 border border-black uppercase">Series: Identity</span>
</div>
<h3 className="font-headline-md text-headline-md leading-tight mb-2 uppercase group-hover:text-primary transition-colors">Who Are You?</h3>
<p className="font-body-md text-body-md text-tertiary mb-4 line-clamp-2">Reclaiming your identity in Christ and shedding the labels the world has placed on you.</p>
<div className="flex items-center justify-between border-t-2 border-black/10 pt-4">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-full border border-black bg-surface-container-highest flex items-center justify-center text-xs font-label-md">ML</div>
<span className="font-label-sm text-xs uppercase">Min. Lisa</span>
</div>
<span className="font-label-sm text-[10px] text-outline uppercase">SEP 26, 2023</span>
</div>
</div>
</div>

<div className="group border-2 border-black bg-white hard-shadow hover:translate-y-[-4px] transition-all">
<div className="relative aspect-video border-b-2 border-black overflow-hidden">
<div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" data-alt="Vision and calling" style={{backgroundImage: "url('/assets/branch-slide-5.jpg')"}}></div>
<div className="absolute bottom-2 right-2 bg-on-background text-white font-label-sm px-2 py-1 text-xs">42:30</div>
</div>
<div className="p-6">
<div className="flex gap-2 mb-3">
<span className="bg-secondary-container text-on-secondary-container text-[10px] font-label-md px-2 py-0.5 border border-black uppercase">Single Message</span>
</div>
<h3 className="font-headline-md text-headline-md leading-tight mb-2 uppercase group-hover:text-primary transition-colors">Mountains of Faith</h3>
<p className="font-body-md text-body-md text-tertiary mb-4 line-clamp-2">Strategies for overcoming the giants in your life through the power of strategic prayer.</p>
<div className="flex items-center justify-between border-t-2 border-black/10 pt-4">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-full border border-black bg-surface-container-highest flex items-center justify-center text-xs font-label-md">JD</div>
<span className="font-label-sm text-xs uppercase">John Doe</span>
</div>
<span className="font-label-sm text-[10px] text-outline uppercase">SEP 19, 2023</span>
</div>
</div>
</div>
</div>

<div className="mt-20 flex justify-center items-center gap-4">
<button className="w-12 h-12 border-2 border-black bg-white flex items-center justify-center hard-shadow-sm btn-press">
<span className="material-symbols-outlined">chevron_left</span>
</button>
<div className="flex gap-2">
<button className="w-12 h-12 border-2 border-black bg-primary text-white font-label-md hard-shadow-sm btn-press">1</button>
<button className="w-12 h-12 border-2 border-black bg-white font-label-md hard-shadow-sm btn-press">2</button>
<button className="w-12 h-12 border-2 border-black bg-white font-label-md hard-shadow-sm btn-press">3</button>
</div>
<button className="w-12 h-12 border-2 border-black bg-white flex items-center justify-center hard-shadow-sm btn-press">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</section>

<section className="bg-surface-container border-y-4 border-black">
<div className="max-w-7xl mx-auto px-margin-desktop py-16">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
<div>
<span className="inline-block bg-secondary-container text-on-secondary-container border-2 border-black font-label-sm uppercase px-3 py-1 hard-shadow-sm mb-4">Listen Anywhere</span>
<h2 className="font-display-lg text-headline-lg leading-tight uppercase">Other Ways To Listen</h2>
</div>
<p className="font-body-lg text-body-md text-on-surface-variant max-w-md">Catch every message on your favourite platform — or take Kharis with you in the app.</p>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
{[
{ label: "Spotify", copy: "Stream the podcast and follow every series.", cta: "Listen on Spotify", href: "https://open.spotify.com/", icon: "podcasts" },
{ label: "SoundCloud", copy: "Audio archive of past teachings and sessions.", cta: "Play on SoundCloud", href: "https://soundcloud.com/", icon: "graphic_eq" },
{ label: "YouTube", copy: "Watch full services, clips and live streams.", cta: "Watch on YouTube", href: "https://youtube.com/@davidantwi", icon: "smart_display" },
{ label: "Kharis App", copy: "Messages, notes and giving in one place.", cta: "Get the App", href: "/#app-stores", icon: "smartphone" },
].map(({ label, copy, cta, href, icon }) => (
<a
key={label}
href={href}
target={href.startsWith("http") ? "_blank" : undefined}
rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
className="group bg-surface-container-high border-2 border-black neo-shadow hover-press flex flex-col p-6"
>
<span className="material-symbols-outlined text-4xl mb-4">{icon}</span>
<h3 className="font-headline-md text-title-lg uppercase mb-2">{label}</h3>
<p className="font-body-lg text-body-md text-on-surface-variant flex-1">{copy}</p>
<span className="mt-6 inline-flex items-center gap-2 font-label-sm uppercase">
{cta}
<span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">arrow_forward</span>
</span>
</a>
))}
</div>
</div>
</section>


<section className="bg-primary text-white border-y-4 border-black relative overflow-hidden">
<div className="absolute inset-0 halftone-pattern opacity-10"></div>
<div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16 relative z-10 flex flex-col md:flex-row items-center justify-between gap-gutter">
<div className="max-w-xl text-center md:text-left">
<h2 className="font-display-lg text-headline-lg leading-tight uppercase mb-4">Never Miss A Word</h2>
<p className="font-body-lg text-body-lg text-primary-fixed">Subscribe to get the latest messages, series notes, and study guides delivered straight to your inbox.</p>
</div>
<div className="flex w-full md:w-auto gap-0 mt-8 md:mt-0">
<input className="flex-1 md:w-80 bg-white border-2 border-black text-black font-label-sm px-6 py-4 focus:ring-4 focus:ring-secondary-container outline-none" placeholder="YOUR EMAIL ADDRESS" type="email"/>
<button className="bg-on-background text-white font-headline-md text-base px-5 sm:px-8 py-4 border-2 border-l-0 shrink-0 border-black hard-shadow btn-press uppercase">Subscribe</button>
</div>
</div>
</section>
</main>

<SiteFooter />


      <ThemeToggle />
    </div>
  );
}

export default MessagesPage;
