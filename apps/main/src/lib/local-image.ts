/** Filenames as they exist in public/images, including the flat names used before that folder was organised. */
const BY_NAME: Record<string, string> = {
  "branch-slide-1.jpg": "/images/branch-slide-1.jpg",
  "branch-slide-2.jpg": "/images/branch-slide-2.jpg",
  "branch-slide-3.jpg": "/images/branch-slide-3.jpg",
  "branch-slide-4.jpg": "/images/branch-slide-4.jpg",
  "branch-slide-5.jpg": "/images/branch-slide-5.jpg",
  "build-house.jpg": "/images/build-house.jpg",
  "community.jpg": "/images/community.jpg",
  "ea-logo-evangelical-alliance.png": "/images/ea-logo-evangelical-alliance.png",
  "kharis-logo.png": "/images/kharis-logo.png",
  "mandate.png": "/images/mandate.png",
  "pastor-stage.jpg": "/images/pastor-stage.jpg",
  "serve-with-us.jpg": "/images/serve-with-us.jpg",
  "testimony-1.jpg": "/images/testimony-1.jpg",
  "testimony-2.jpg": "/images/testimony-2.jpg",
  "testimony-3.jpg": "/images/testimony-3.jpg",
  "vision-campaign.jpg": "/images/vision-campaign.jpg",
  "worship.jpg": "/images/worship.jpg",
  "young-adults.jpg": "/images/young-adults.jpg",
  "step-1-messages.png": "/images/app-steps/step-1-messages.png",
  "step-2-browse.png": "/images/app-steps/step-2-browse.png",
  "step-3-player.png": "/images/app-steps/step-3-player.png",
  "app-steps-step-1-messages.png": "/images/app-steps/step-1-messages.png",
  "app-steps-step-2-browse.png": "/images/app-steps/step-2-browse.png",
  "app-steps-step-3-player.png": "/images/app-steps/step-3-player.png",
  "hero-worship.jpg": "/images/events/hero-worship.jpg",
  "events-hero-worship.jpg": "/images/events/hero-worship.jpg",
  "sunday-service.jpg": "/images/events/sunday-service.jpg",
  "events-sunday-service.jpg": "/images/events/sunday-service.jpg",
  "thursday-service.jpg": "/images/events/thursday-service.jpg",
  "events-thursday-service.jpg": "/images/events/thursday-service.jpg",
  "pastor-awo.jpg": "/images/leadership/pastor-awo.jpg",
  "pastor-david.jpg": "/images/leadership/pastor-david.jpg",
  "pastors-together.jpg": "/images/leadership/pastors-together.jpg",
  "leadership-pastor-awo.jpg": "/images/leadership/pastor-awo.jpg",
  "leadership-pastor-david.jpg": "/images/leadership/pastor-david.jpg",
  "leadership-pastors-together.jpg": "/images/leadership/pastors-together.jpg",
};

/**
 * A URL the content studio saved: Supabase Storage, the current kharis.org
 * uploads, or a Cloudflare R2 object. Remote URLs are kept as stored.
 * `branch-images/...` keys are joined to NEXT_PUBLIC_R2_PUBLIC_URL.
 * Placeholder paths such as `assets/design/...` return null.
 */
export function studioImage(url: string | null | undefined): string | null {
  const value = url?.trim();
  if (!value || /instagram\.com/i.test(value)) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("branch-images/")) {
    const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "");
    return base ? `${base}/${value}` : null;
  }
  if (value.startsWith("/images/") || value.startsWith("/videos/")) return value;
  const name = decodeURIComponent(value.split("?")[0]?.split("/").pop() ?? "");
  return BY_NAME[name] ?? null;
}

/** Studio image when one exists, otherwise a file in public/images. */
export function localImage(url: string | null | undefined, fallback: string) {
  return studioImage(url) ?? fallback;
}
