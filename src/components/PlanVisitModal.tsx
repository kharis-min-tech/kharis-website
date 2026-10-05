"use client";

import React, { useState } from "react";
import {
  MapPin,
  Check,
  X,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PlanVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchName?: string;
  branchCity?: string;
  eventLabel?: string | null;
}

export default function PlanVisitModal({
  isOpen,
  onClose,
  branchName,
  branchCity,
  eventLabel,
}: PlanVisitModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("Next Sunday");
  const [children, setChildren] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setBusy(true);
    setError("");
    const parts = name.trim().split(/\s+/);
    const first = parts[0] || name;
    const last = parts.slice(1).join(" ") || first;
    const place = branchName || branchCity || "a Kharis branch";
    const message = [
      `Plan your visit request for ${place}.`,
      `Preferred gathering: ${eventLabel || date}.`,
      children ? "Bringing children (ages 0-12)." : "No children noted.",
      phone ? `Phone: ${phone}` : null,
    ]
      .filter(Boolean)
      .join(" ");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first,
          last,
          email,
          phone,
          topic: "Sunday visit",
          branch: branchName || "",
          message,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setIsSubmitted(true);
      window.setTimeout(() => {
        setIsSubmitted(false);
        setName("");
        setEmail("");
        setPhone("");
        setChildren(false);
        onClose();
      }, 2400);
    } catch {
      setError("Something went wrong. Please try the contact page.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-[#15131f] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#2e2942] relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#2e2942]">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#800654] text-white shadow-md shadow-[#800654]/30">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-white!">
                  Plan Your Visit
                </h3>
                <p className="text-xs font-semibold text-[#b2aec1]">
                  {branchName
                    ? `We are excited to host you at ${branchName}.`
                    : "We are excited to host you and your family."}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#b2aec1] hover:text-[#f3f0f8] hover:bg-[#201d2e] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#800654]/20 text-[#e8a33d] mx-auto flex items-center justify-center">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h4 className="text-2xl font-extrabold text-[#f3f0f8]">
                You are all set, {name.split(" ")[0]}!
              </h4>
              <p className="text-sm font-semibold text-[#b2aec1] max-w-sm mx-auto">
                Our host team has your details and will follow up before your
                visit.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#e8a33d] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-3 rounded-2xl border border-[#2e2942] bg-[#1a1826] text-sm font-bold text-[#f3f0f8] focus:outline-none focus:ring-2 focus:ring-[#800654]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#e8a33d] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sarah@example.com"
                  className="w-full px-4 py-3 rounded-2xl border border-[#2e2942] bg-[#1a1826] text-sm font-bold text-[#f3f0f8] focus:outline-none focus:ring-2 focus:ring-[#800654]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#e8a33d] mb-1">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7000 000000"
                  className="w-full px-4 py-3 rounded-2xl border border-[#2e2942] bg-[#1a1826] text-sm font-bold text-[#f3f0f8] focus:outline-none focus:ring-2 focus:ring-[#800654]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#e8a33d] mb-1">
                  Which gathering will you attend?
                </label>
                <select
                  value={eventLabel || date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-[#2e2942] bg-[#1a1826] text-sm font-bold text-[#f3f0f8] focus:outline-none focus:ring-2 focus:ring-[#800654]"
                >
                  {eventLabel ? (
                    <option value={eventLabel}>{eventLabel}</option>
                  ) : null}
                  <option value="Next Sunday">Next Sunday service</option>
                  <option value="Midweek">Midweek gathering</option>
                  <option value="Other">Other / not sure yet</option>
                </select>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1a1826] border border-[#2e2942]">
                <input
                  type="checkbox"
                  id="kids"
                  checked={children}
                  onChange={(e) => setChildren(e.target.checked)}
                  className="w-4 h-4 rounded text-[#800654] focus:ring-[#800654] bg-[#15131f] border-[#2e2942]"
                />
                <label
                  htmlFor="kids"
                  className="text-xs font-bold text-[#f3f0f8] cursor-pointer"
                >
                  I will be bringing children (ages 0-12) for Kharis Kids
                </label>
              </div>

              {error ? (
                <p className="text-xs font-semibold text-[#ff8a8a]">{error}</p>
              ) : null}

              <button
                type="submit"
                disabled={busy}
                className="w-full py-4 rounded-2xl bg-[#800654] hover:bg-[#5c033c] text-white font-extrabold text-base shadow-lg shadow-[#800654]/30 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                <span>{busy ? "Sending…" : "Confirm my visit"}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
