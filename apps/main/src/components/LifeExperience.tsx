"use client";

import { useCallback, useEffect, useState } from "react";
import { lifeBySlug, type LifeSlug } from "@/lib/life-content";
import { LifeDetailModal, type FastingDownloads } from "@/components/LifeDetailModal";
import "./life-refresh.css";
import "./life-alone.css";

export function LifeExperience({ fastingDownloads }: { fastingDownloads?: FastingDownloads }) {
  const [modalSlug, setModalSlug] = useState<LifeSlug | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("open");
    if (slug === "departments") {
      window.location.replace("/life/departments");
      return;
    }
    if (slug === "fasting" || slug === "marriage" || slug === "k-group") {
      setModalSlug(slug);
    }
  }, []);

  const closeModal = useCallback(() => {
    setModalSlug(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("open");
    window.history.replaceState(null, "", url);
  }, []);

  const modalCategory = modalSlug ? (lifeBySlug(modalSlug) ?? null) : null;

  return (
    <LifeDetailModal
      category={modalCategory}
      onClose={closeModal}
      fastingDownloads={fastingDownloads}
    />
  );
}
