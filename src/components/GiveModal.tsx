"use client";

import React, { useState } from 'react';
import { Heart, X, Check, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GiveModal({ isOpen, onClose }: GiveModalProps) {
  const [amount, setAmount] = useState<number | string>(100);
  const [fund, setFund] = useState('Tithes & Offerings');
  const [frequency, setFrequency] = useState<'one-time' | 'recurring'>('one-time');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const presetAmounts = [25, 50, 100, 250, 500];
  const funds = [
    'Tithes & Offerings',
    'Kharis Outreach & Missions',
    'Youth & NextGen Ministry',
    'Building & Expansion Fund',
  ];

  const handleCompleteGive = (e: React.FormEvent) => {
    e.preventDefault();
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
              <div className="p-2.5 rounded-xl bg-[#d4920a] text-white shadow-md shadow-[#d4920a]/30">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-[#f3f0f8]">Kharis Generosity</h3>
                <p className="text-xs font-semibold text-[#b2aec1]">Empowering Ministry & Community Transformation</p>
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
              <div className="w-16 h-16 rounded-full bg-[#d4920a]/10 text-[#d4920a] mx-auto flex items-center justify-center">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h4 className="text-2xl font-extrabold text-[#f3f0f8]">Thank You For Your Heart!</h4>
              <p className="text-sm font-semibold text-[#b2aec1] max-w-sm mx-auto">
                Your contribution of <span className="font-bold text-[#d4920a]">${amount}</span> directly fuels transformation and hope.
              </p>
            </div>
          ) : (
            <form onSubmit={handleCompleteGive} className="space-y-5 pt-5">
              {/* Frequency Selector */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#1a1826] rounded-2xl border border-[#2e2942]">
                <button
                  type="button"
                  onClick={() => setFrequency('one-time')}
                  className={`py-2.5 text-xs font-extrabold rounded-xl transition-all ${
                    frequency === 'one-time'
                      ? 'bg-[#800654] text-white shadow-md shadow-[#800654]/20'
                      : 'text-[#b2aec1] hover:text-[#f3f0f8]'
                  }`}
                >
                  One-Time Gift
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency('recurring')}
                  className={`py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    frequency === 'recurring'
                      ? 'bg-[#800654] text-white shadow-md shadow-[#800654]/20'
                      : 'text-[#b2aec1] hover:text-[#f3f0f8]'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Monthly Recurring
                </button>
              </div>

              {/* Fund Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#e8a33d] mb-2">
                  Select Giving Designation
                </label>
                <select
                  value={fund}
                  onChange={(e) => setFund(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-[#2e2942] bg-[#1a1826] text-sm font-bold text-[#f3f0f8] focus:outline-none focus:ring-2 focus:ring-[#800654]"
                >
                  {funds.map((f) => (
                    <option key={f} value={f} className="bg-[#1a1826] text-[#f3f0f8]">
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount Grid */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#e8a33d] mb-2">
                  Select Amount
                </label>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt)}
                      className={`py-2.5 rounded-xl font-extrabold text-sm transition-all ${
                        amount === amt
                          ? 'bg-[#d4920a] text-white shadow-md shadow-[#d4920a]/25'
                          : 'bg-[#1a1826] text-[#f3f0f8] hover:bg-[#201d2e] border border-[#2e2942]'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#b2aec1]">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Custom amount"
                    className="w-full pl-8 pr-4 py-3 rounded-2xl border border-[#2e2942] bg-[#1a1826] text-sm font-bold text-[#f3f0f8] focus:outline-none focus:ring-2 focus:ring-[#800654]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#d4920a] hover:bg-[#b87a08] text-white font-extrabold text-base shadow-lg shadow-[#d4920a]/30 transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>Give ${amount || '0'} Now</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#b2aec1] pt-1">
                <ShieldCheck className="w-4 h-4 text-[#e8a33d]" />
                <span>256-bit Encrypted & Bank-Grade Secure Giving</span>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
