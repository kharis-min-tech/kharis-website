"use client";
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';
import type { BranchData } from '@/data/branchesData';

interface BranchContactFormProps {
  branch: BranchData;
}

export function BranchContactForm({ branch }: BranchContactFormProps) {
  const [sent, setSent] = useState(false);

  const inputClass =
    'w-full rounded-xl border border-white/12 bg-black/40 px-4 py-3 text-sm font-medium text-white placeholder:text-gray-500 outline-none transition-colors focus:border-[#e8a33d]';
  const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400';

  return (
    <section id="contact" className="py-16 px-5 md:px-8 max-w-[1536px] mx-auto">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3.5 py-1 text-xs font-bold text-[#e8a33d]">
            <span>Say Hello</span>
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white">
            Contact {branch.city}
          </h2>
          <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-gray-300">
            Have a question, a prayer request, or want to know more before you visit? Our
            {' '}{branch.city} team would love to hear from you.
          </p>

          <div className="mt-8 space-y-3">
            <a
              href={`mailto:${branch.email}`}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#15131f] px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:border-[#e8a33d]/40"
            >
              <Mail className="h-4 w-4 text-[#e8a33d]" />
              {branch.email}
            </a>
            <a
              href={`tel:${branch.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#15131f] px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:border-[#e8a33d]/40"
            >
              <Phone className="h-4 w-4 text-[#e8a33d]" />
              {branch.phone}
            </a>
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#15131f] px-4 py-3.5 text-sm font-semibold text-white">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e8a33d]" />
              {branch.fullAddress}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="rounded-[2rem] border border-white/10 bg-[#15131f] p-6 sm:p-9"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="firstName">First name *</label>
                <input id="firstName" name="firstName" required className={inputClass} placeholder="Jane" />
              </div>
              <div>
                <label className={labelClass} htmlFor="lastName">Last name *</label>
                <input id="lastName" name="lastName" required className={inputClass} placeholder="Doe" />
              </div>
              <div>
                <label className={labelClass} htmlFor="phone">Phone number *</label>
                <input id="phone" name="phone" type="tel" required className={inputClass} placeholder="+44 7000 000000" />
              </div>
              <div>
                <label className={labelClass} htmlFor="email">Email *</label>
                <input id="email" name="email" type="email" required className={inputClass} placeholder="you@email.com" />
              </div>
            </div>

            <div className="mt-5">
              <label className={labelClass} htmlFor="message">Comment or message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className={`${inputClass} resize-y`}
                placeholder={`Tell the ${branch.city} team how we can help…`}
              />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#800654] px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-[#800654]/25 transition-all hover:-translate-y-0.5 hover:bg-[#5c033c] cursor-pointer"
              >
                {sent ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                <span>{sent ? 'Message Sent' : 'Send Message'}</span>
              </button>
              {sent && (
                <span className="text-xs font-semibold text-[#e8a33d]">
                  Thank you — the {branch.city} team will be in touch shortly.
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default BranchContactForm;
