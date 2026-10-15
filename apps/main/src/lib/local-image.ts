import siteImages from "./site-image-urls.json";

/** Legacy studio filenames mapped to the migrated Cloudflare pictures. */
const BY_NAME: Record<string, string> = {
  "branch-slide-1.jpg":
    "https://images.kharis.org/site-images/main/571e499ea60fdffc/branch-slide-1.jpg",
  "branch-slide-2.jpg":
    "https://images.kharis.org/site-images/main/79f53822455f01b0/branch-slide-2.jpg",
  "branch-slide-3.jpg":
    "https://images.kharis.org/site-images/main/3f1f49569aefd282/branch-slide-3.jpg",
  "branch-slide-4.jpg":
    "https://images.kharis.org/site-images/main/074fce9dca42072a/branch-slide-4.jpg",
  "branch-slide-5.jpg":
    "https://images.kharis.org/site-images/main/4cdb8d19355fced2/branch-slide-5.jpg",
  "build-house.jpg": "https://images.kharis.org/site-images/main/13d810aec7f7b02a/build-house.jpg",
  "community.jpg": "https://images.kharis.org/site-images/main/ca1bcf57dbf80629/community.jpg",
  "ea-logo-evangelical-alliance.png":
    "https://images.kharis.org/site-images/main/247116431c0e4a3f/ea-logo-evangelical-alliance.png",
  "kharis-logo.png": "https://images.kharis.org/site-images/main/113a6a24b1d3741b/kharis-logo.png",
  "mandate.png": "https://images.kharis.org/site-images/main/c3bfa8102ef6e326/mandate.png",
  "pastor-stage.jpg":
    "https://images.kharis.org/site-images/main/ffbe5aca25d25b8c/pastor-stage.jpg",
  "serve-with-us.jpg":
    "https://images.kharis.org/site-images/main/8440a4a63e4ae020/serve-with-us.jpg",
  "testimony-1.jpg": "https://images.kharis.org/site-images/main/e72bc6cd2499f16c/testimony-1.jpg",
  "testimony-2.jpg": "https://images.kharis.org/site-images/main/15638c2668f428de/testimony-2.jpg",
  "testimony-3.jpg": "https://images.kharis.org/site-images/main/ec76da04c71300ad/testimony-3.jpg",
  "vision-campaign.jpg":
    "https://images.kharis.org/site-images/main/91479ba234a71277/vision-campaign.jpg",
  "worship.jpg": "https://images.kharis.org/site-images/main/9b547f88f3b4d297/worship.jpg",
  "young-adults.jpg":
    "https://images.kharis.org/site-images/main/234c625e119f9e2a/young-adults.jpg",
  "step-1-messages.png":
    "https://images.kharis.org/site-images/main/0cae2b998ffa6335/app-steps/step-1-messages.png",
  "step-2-browse.png":
    "https://images.kharis.org/site-images/main/c9ae7d1c19dd35f4/app-steps/step-2-browse.png",
  "step-3-player.png":
    "https://images.kharis.org/site-images/main/0c5df54aeea92af4/app-steps/step-3-player.png",
  "app-steps-step-1-messages.png":
    "https://images.kharis.org/site-images/main/0cae2b998ffa6335/app-steps/step-1-messages.png",
  "app-steps-step-2-browse.png":
    "https://images.kharis.org/site-images/main/c9ae7d1c19dd35f4/app-steps/step-2-browse.png",
  "app-steps-step-3-player.png":
    "https://images.kharis.org/site-images/main/0c5df54aeea92af4/app-steps/step-3-player.png",
  "hero-worship.jpg":
    "https://images.kharis.org/site-images/main/2bf8a23f06e5bb67/events/hero-worship.jpg",
  "events-hero-worship.jpg":
    "https://images.kharis.org/site-images/main/2bf8a23f06e5bb67/events/hero-worship.jpg",
  "sunday-service.jpg":
    "https://images.kharis.org/site-images/main/d6b67a1d5d3003b0/events/sunday-service.jpg",
  "events-sunday-service.jpg":
    "https://images.kharis.org/site-images/main/d6b67a1d5d3003b0/events/sunday-service.jpg",
  "thursday-service.jpg":
    "https://images.kharis.org/site-images/main/dd56ea86ee00aa8d/events/thursday-service.jpg",
  "events-thursday-service.jpg":
    "https://images.kharis.org/site-images/main/dd56ea86ee00aa8d/events/thursday-service.jpg",
  "pastor-awo.jpg":
    "https://images.kharis.org/site-images/main/4db8231b19f778f9/leadership/pastor-awo.jpg",
  "pastor-david.jpg":
    "https://images.kharis.org/site-images/main/64154a5197622b53/leadership/pastor-david.jpg",
  "pastors-together.jpg":
    "https://images.kharis.org/site-images/main/9804bc45d0e21f85/leadership/pastors-together.jpg",
  "leadership-pastor-awo.jpg":
    "https://images.kharis.org/site-images/main/4db8231b19f778f9/leadership/pastor-awo.jpg",
  "leadership-pastor-david.jpg":
    "https://images.kharis.org/site-images/main/64154a5197622b53/leadership/pastor-david.jpg",
  "leadership-pastors-together.jpg":
    "https://images.kharis.org/site-images/main/9804bc45d0e21f85/leadership/pastors-together.jpg",
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
  if (value.startsWith("/images/") || value.startsWith("/videos/")) {
    const path = value.split(/[?#]/)[0];
    const migrated = (siteImages as Record<string, string>)[path];
    return migrated ? migrated + value.slice(path.length) : value;
  }
  const name = decodeURIComponent(value.split("?")[0]?.split("/").pop() ?? "");
  return BY_NAME[name] ?? null;
}

/** Studio image when one exists, otherwise the supplied Cloudflare fallback. */
export function localImage(url: string | null | undefined, fallback: string) {
  return studioImage(url) ?? fallback;
}
