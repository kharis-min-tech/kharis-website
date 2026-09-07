"use client";

import React, { useState } from 'react';
import { MapPin, Check, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlanVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlanVisitModal({ isOpen, onClose }: PlanVisitModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('Next Sunday (10:00 AM)');
  const [children, setChildren] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2500);
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
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#2e2942]">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#800654] text-white shadow-md shadow-[#800654]/30">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-white!">Plan Your Visit</h3>
                <p className="text-xs font-semibold text-[#b2aec1]">We&apos;re Excited To Host You & Your Family!</p>
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
              <h4 className="text-2xl font-extrabold text-[#f3f0f8]">You&apos;re All Set, {name}!</h4>
              <p className="text-sm font-semibold text-[#b2aec1] max-w-sm mx-auto">
                Our host team will meet you at the Welcome Lounge with reserved VIP seating and a special gift bag!
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
                  Which Service Will You Attend?
                </label>
                <select
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-[#2e2942] bg-[#1a1826] text-sm font-bold text-[#f3f0f8] focus:outline-none focus:ring-2 focus:ring-[#800654]"
                >
                  <option value="Next Sunday (10:00 AM)" className="bg-[#1a1826] text-[#f3f0f8]">Next Sunday Service (10:00 AM EST)</option>
                  <option value="Midweek Worship (7:00 PM)" className="bg-[#1a1826] text-[#f3f0f8]">Midweek Growth Night (Wed 7:00 PM)</option>
                  <option value="Kharis Youth (Fri 6:30 PM)" className="bg-[#1a1826] text-[#f3f0f8]">Kharis NextGen Youth (Fri 6:30 PM)</option>
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
                <label htmlFor="kids" className="text-xs font-bold text-[#f3f0f8] cursor-pointer">
                  I will be bringing children (Ages 0-12) for Kharis Kids Check-in
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#800654] hover:bg-[#5c033c] text-white font-extrabold text-base shadow-lg shadow-[#800654]/30 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Confirm My VIP Visit RSVP</span>
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="text-center text-xs font-semibold text-[#b2aec1] pt-1">
                📍 700 Grace Way • Free parking available
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
