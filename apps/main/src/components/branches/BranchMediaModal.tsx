"use client";
import React, { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BranchMediaModalProps {
  type: 'image' | 'video' | null;
  imageSrc?: string;
  videoId?: string;
  city?: string;
  onClose: () => void;
}

export function BranchMediaModal({
  type,
  imageSrc,
  videoId,
  city = '',
  onClose,
}: BranchMediaModalProps) {
  useEffect(() => {
    if (!type) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [type, onClose]);

  return (
    <AnimatePresence>
      {type && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <button
            type="button"
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-default"
            aria-label="Close media"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0710] shadow-2xl"
          >
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white transition-colors hover:bg-white/10 cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {type === 'image' && imageSrc && (
              <div className="flex h-full max-h-[80vh] items-center justify-center p-2">
                <img
                  src={imageSrc}
                  alt={`Kharis ${city} gathering`}
                  className="max-h-[78vh] w-full rounded-3xl object-contain"
                />
              </div>
            )}

            {type === 'video' && videoId && (
              <div className="aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                  title={`Kharis ${city} message`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            )}

            {type === 'video' && !videoId && (
              <div className="flex aspect-video flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-lg font-bold text-white">No featured video for this branch yet.</p>
                <a
                  href="https://www.youtube.com/@kharischurch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#800654] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#5c033c]"
                >
                  <span>Watch on YouTube</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BranchMediaModal;
