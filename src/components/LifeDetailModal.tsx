"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { LifeIcon } from "@/components/LifeIcon";
import { type LifeCategory } from "@/lib/life-content";
import {
  lifeModalBlurb,
  lifeModalVideoId,
  type LifeModalSlug,
  youtubeEmbedSrc,
} from "@/lib/life-videos";

type Props = {
  category: LifeCategory | null;
  baptismVideoId?: string;
  onClose: () => void;
};

export function LifeDetailModal({
  category,
  baptismVideoId,
  onClose,
}: Props) {
  const reduce = useReducedMotion();
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!category) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [category, onClose]);

  if (!mounted) return null;

  const slug = category?.slug as LifeModalSlug | undefined;
  const videoId = slug ? lifeModalVideoId(slug, baptismVideoId) : "";
  const blurb = slug ? lifeModalBlurb(slug) : "";

  return createPortal(
    <AnimatePresence>
      {category && slug ? (
        <motion.div
          className="life-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <button
            type="button"
            className="life-modal__scrim"
            aria-label="Close video"
            onClick={onClose}
          />

          <motion.div
            className="life-modal__panel life-modal__panel--video"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduce ? false : { opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
          >
            <div className="life-modal__toolbar">
              <p className="life-modal__toolbar-label">{category.badge}</p>
              <button
                type="button"
                className="life-modal__close"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={2.25} />
              </button>
            </div>

            <div className="life-modal__video-wrap">
              <iframe
                src={youtubeEmbedSrc(videoId)}
                title={`${category.title} | Kharis Life`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="life-modal__video"
              />
            </div>

            <div className="life-modal__body life-modal__body--video">
              <h2 id={titleId} className="life-modal__title">
                <LifeIcon name={category.icon} className="life-modal__ico" />
                {category.title}
              </h2>
              <p className="life-modal__intro life-modal__intro--short">{blurb}</p>

              <div className="life-modal__actions">
                <Link href={category.cta.href} className="life-cta" onClick={onClose}>
                  {category.cta.label}
                  <Icon name="arrow" className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
