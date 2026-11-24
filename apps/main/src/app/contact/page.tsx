import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactExperience } from "@/components/ContactExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getContactLocations } from "@/lib/contactLocations";
import {
  fetchSiteContents,
  listOrFallback,
  listSlot,
  mediaOrFallback,
  singleSlot,
} from "@/lib/site-contents";

export const metadata: Metadata = {
  title: "Contact | Kharis Church",
  description:
    "Write to Kharis about a first visit, prayer, pastoral care or baptism, and find service times, directions and a map for every Kharis branch.",
};

const HERO_FALLBACKS = [
  {
    src: "https://images.kharis.org/site-images/main/56fc2395a9b23afb/contact/easter-welcome-wave.jpg",
    alt: "Two women waving as they arrive for the Easter Saturday service",
    caption: "Easter Saturday",
    spot: "hello-hero__photo--a",
  },
  {
    src: "https://images.kharis.org/site-images/main/421991ee4530d49b/contact/easter-door-greeter.jpg",
    alt: "A greeter welcoming people at the door on a London street before the Easter Saturday service",
    caption: "Welcome at the door",
    spot: "hello-hero__photo--b",
  },
  {
    src: "https://images.kharis.org/site-images/main/548f1d84de49653b/contact/after-service-handshake.jpg",
    alt: "Two men shaking hands after a Sunday service",
    caption: "After service",
    spot: "hello-hero__photo--c",
  },
  {
    src: "https://images.kharis.org/site-images/main/fb9b5e9814886abb/contact/service-prayer.jpg",
    alt: "People praying together at a Kharis service",
    caption: "Prayer",
    spot: "hello-hero__photo--d",
  },
];

const LETTER_FALLBACK =
  "https://images.kharis.org/site-images/main/67210f0fba54b6a1/contact/after-service-conversation.jpg";

export default async function ContactPage() {
  const [locations, contents] = await Promise.all([
    getContactLocations(),
    fetchSiteContents("kharis"),
  ]);
  const spotlight = listSlot(contents, "contact", "heroSpotlight");
  const heroPhotos = HERO_FALLBACKS.map((photo, index) => ({
    ...photo,
    src: listOrFallback(
      spotlight,
      HERO_FALLBACKS.map((item) => item.src),
    )[index]!,
    alt: spotlight[index]?.alt || photo.alt,
  }));
  const letterSlot = singleSlot(contents, "contact", "letterPhoto");

  return (
    <main className="site-page text-fg">
      {/* Hero is a page surface now, so the header follows the theme. */}
      <SiteHeader tone="light" />
      <Suspense fallback={null}>
        <ContactExperience
          locations={locations}
          heroPhotos={heroPhotos}
          letterPhoto={mediaOrFallback(letterSlot, LETTER_FALLBACK)}
          letterPhotoAlt={letterSlot?.alt || "Two women talking after a Sunday service"}
        />
      </Suspense>
      <SiteFooter />
    </main>
  );
}
