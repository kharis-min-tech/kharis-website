import type { Metadata } from "next";
import { hasCoords, type Branch } from "@/lib/branches";
import type { ChurchEvent } from "@/lib/events";

export const SITE_NAME = "Kharis Phase 2";
export const SITE_TAGLINE = "Faith Looks Different Here";
export const SITE_DESCRIPTION =
  "Kharis Phase 2 is a youth church community across the UK — worship, fellowships, events, messages from Pastor David Antwi, and giving. Faith looks different here.";

export const SOCIAL_LINKS = [
  "https://www.instagram.com/kharisphasetwo/",
  "https://www.youtube.com/@davidantwi",
] as const;

export const STATIC_PATHS = [
  "/",
  "/mission",
  "/governance",
  "/life",
  "/fellowships",
  "/departments",
  "/events",
  "/messages",
  "/media",
  "/giving",
  "/contact",
  "/branches",
] as const;

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://kharisphase2.org").replace(
    /\/$/,
    "",
  );
}

export function absoluteUrl(path: string) {
  if (!path) return siteUrl();
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMeta({
  title,
  description,
  path,
  image,
  noIndex,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const isHome = path === "/";
  const fullTitle = isHome ? `${SITE_NAME} | ${SITE_TAGLINE}` : `${title} | ${SITE_NAME}`;
  const url = absoluteUrl(path);

  return {
    title: isHome ? { absolute: fullTitle } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_GB",
      type: "website",
      ...(image
        ? { images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: fullTitle }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  const url = siteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Church",
        "@id": `${url}/#church`,
        name: SITE_NAME,
        alternateName: ["KP2", "Kharis Phase Two"],
        url,
        description: SITE_DESCRIPTION,
        image: absoluteUrl("/assets/worship.jpg"),
        logo: absoluteUrl("/assets/kp2-logo-new.png"),
        sameAs: [...SOCIAL_LINKS],
        parentOrganization: {
          "@type": "NGO",
          name: "Kharis Ministries",
          identifier: "1139291",
        },
        areaServed: {
          "@type": "Country",
          name: "United Kingdom",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en-GB",
        publisher: { "@id": `${url}/#church` },
      },
    ],
  };
}

export function eventsJsonLd(events: ChurchEvent[]) {
  const url = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} upcoming events`,
    itemListElement: events.slice(0, 12).map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        name: event.title,
        description: event.blurb,
        startDate: event.starts,
        endDate: event.ends || undefined,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: event.location,
          address: event.location,
        },
        organizer: {
          "@type": "Church",
          name: SITE_NAME,
          url,
        },
        image: event.image ? absoluteUrl(event.image) : undefined,
      },
    })),
  };
}

export function branchJsonLd(branch: Branch) {
  const url = absoluteUrl(`/branches/${branch.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Church",
    name: branch.name,
    description: branch.blurb,
    url,
    image: absoluteUrl(branch.image),
    telephone: branch.phone || undefined,
    email: branch.email || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address,
      addressLocality: branch.city,
      postalCode: branch.postcode || undefined,
      addressCountry: "GB",
    },
    ...(hasCoords(branch)
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: branch.lat,
            longitude: branch.lng,
          },
        }
      : {}),
    parentOrganization: {
      "@type": "NGO",
      name: "Kharis Ministries",
      identifier: "1139291",
    },
  };
}
