"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";




function LifePage() {
  return (
    <div className="bg-background text-on-background font-body-md selection:bg-secondary-container selection:text-on-secondary-container overflow-x-hidden">
      <SiteHeader />

      <header className="relative min-h-[620px] md:min-h-[760px] lg:min-h-[921px] flex items-center pt-24 overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-60">
          <div className="w-full h-full bg-cover bg-center" data-alt="Young adults at Kharis Life" style={{backgroundImage: "url('/assets/young-adults.jpg')"}}></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

        <div className="absolute inset-0 halftone-pattern text-primary opacity-20 pointer-events-none"></div>
        <div className="relative z-10 px-margin-desktop w-full max-w-7xl mx-auto flex flex-col items-start gap-6">
          <div className="bg-secondary-container text-on-secondary-container px-4 py-1 border-2 border-black inline-block font-label-md text-label-md uppercase -rotate-2 animate-bounce motion-reduce:animate-none">Lifestyle</div>
          <h1 className="font-display-lg text-display-lg max-w-4xl leading-[1] tracking-tighter uppercase mb-4">
            This isn't just a church.<br/>
            <span className="text-primary-fixed bg-primary px-4 py-2 inline-block skew-x-3">It's a Movement.</span>
          </h1>
          <p className="font-body-lg text-body-lg max-w-2xl text-surface-variant font-medium">
            Experience a high-energy community where faith meets urban culture. We are young, bold, and driven by a mission to transform the world through love and creativity.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8">
            <Link
              href="/branches"
              className="bg-primary text-white px-8 py-4 border-4 border-black neo-shadow-lg font-headline-md text-headline-md uppercase hover-press transition-all skew-hover inline-block"
            >
              Find Your Branch
            </Link>
            <Link
              href="/messages"
              className="bg-white text-black px-8 py-4 border-4 border-black neo-shadow-lg font-headline-md text-headline-md uppercase hover-press transition-all skew-hover inline-block"
            >
              Watch Message
            </Link>
          </div>
        </div>

      </header>

      <main className="relative z-20">
        {/* Fellowship section removed */}


        <section className="py-stack-lg px-margin-desktop max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-secondary-container border-2 border-black rounded-full halftone-pattern -z-10"></div>
                <div className="bg-white border-4 border-black p-8 neo-shadow relative z-10 rotate-1">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary flex items-center justify-center border-2 border-black">
                      <span className="material-symbols-outlined text-white" style={{fontVariationSettings: "'FILL' 1"}}>event</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md uppercase">Upcoming Socials</h3>
                  </div>
                  <ul className="space-y-6">
                    <li className="flex gap-4 items-start group">
                      <div className="font-label-md text-label-md text-primary w-12 pt-1 uppercase">Jun 12</div>
                      <div className="flex-1">
                        <h4 className="font-body-lg text-body-lg font-bold group-hover:text-primary transition-colors cursor-pointer">Summer Rooftop Kickoff</h4>
                        <p className="font-body-md text-body-md text-on-surface-variant">Music, sliders, and sunset vibes at the City Campus.</p>
                      </div>
                    </li>
                    <li className="flex gap-4 items-start group">
                      <div className="font-label-md text-label-md text-primary w-12 pt-1 uppercase">Jun 28</div>
                      <div className="flex-1 border-t-2 border-outline-variant pt-4">
                        <h4 className="font-body-lg text-body-lg font-bold group-hover:text-primary transition-colors cursor-pointer">Creative Night Out</h4>
                        <p className="font-body-md text-body-md text-on-surface-variant">Gallery crawl and post-show discussion with local artists.</p>
                      </div>
                    </li>
                    <li className="flex gap-4 items-start group">
                      <div className="font-label-md text-label-md text-primary w-12 pt-1 uppercase">Jul 05</div>
                      <div className="flex-1 border-t-2 border-outline-variant pt-4">
                        <h4 className="font-body-lg text-body-lg font-bold group-hover:text-primary transition-colors cursor-pointer">The Big Game Watch</h4>
                        <p className="font-body-md text-body-md text-on-surface-variant">Huge screens, pizza, and friendly rivalry in the Sports Hall.</p>
                      </div>
                    </li>
                  </ul>
                  <Link
                    href="/events"
                    className="block w-full mt-10 bg-primary text-white py-4 border-4 border-black neo-shadow hover-press font-headline-md text-headline-md uppercase skew-x-2 text-center"
                  >
                    See More
                  </Link>
                </div>
              </div>
            </div>
            <div className="md:col-span-7 order-1 md:order-2">
              <div className="p-8">
                <div className="inline-block bg-primary-container text-on-primary-container px-3 py-1 font-label-md text-label-md uppercase mb-6">Stay Connected</div>
                <h2 className="font-display-lg text-headline-lg uppercase leading-[0.9] mb-8">Follow the <br/><span className="text-primary italic">Movement</span> online</h2>
                <p className="font-body-lg text-body-lg text-on-surface mb-8">Get daily inspiration, community highlights, and real-time event updates. We’re building a kingdom culture that doesn't stop when the Sunday service ends.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a className="flex items-center gap-3 border-4 border-black p-4 bg-white hover:bg-secondary-container transition-colors neo-shadow group" href="https://instagram.com/kharisphasetwo" target="_blank" rel="noreferrer">
                    <span className="material-symbols-outlined text-4xl shrink-0">photo_camera</span>
                    <div className="min-w-0">
                      <p className="font-label-md text-label-md uppercase">Instagram</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-secondary-container break-all">@kharisphasetwo</p>
                    </div>
                  </a>
                  <a className="flex items-center gap-3 border-4 border-black p-4 bg-white hover:bg-primary hover:text-white transition-colors neo-shadow group" href="https://youtube.com/@davidantwi" target="_blank" rel="noreferrer">
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

        <section className="bg-primary py-20 relative overflow-hidden">
          <div className="absolute inset-0 halftone-pattern text-black/20"></div>
          <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10">
            <h2 className="font-display-lg text-headline-lg text-white uppercase mb-4">Don't Miss a beat.</h2>
            <p className="text-primary-fixed font-body-lg text-body-lg mb-10">Sign up for our weekly 'Life Update' and never miss out on a social or small group gathering.</p>
            <form className="flex flex-col md:flex-row gap-4">
              <input className="flex-1 px-6 py-4 border-4 border-black font-label-md text-label-md focus:ring-4 focus:ring-secondary focus:outline-none bg-white" placeholder="YOUR EMAIL ADDRESS" type="email"/>
              <button className="bg-black text-white px-10 py-4 border-4 border-black font-headline-md text-headline-md uppercase neo-shadow hover-press transition-all">Subscribe Now</button>
            </form>
          </div>
        </section>
      </main>

      <SiteFooter />
      <ThemeToggle />
    </div>
  );
}

export default LifePage;
