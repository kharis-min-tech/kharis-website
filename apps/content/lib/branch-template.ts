import type { BranchDraft, ServiceDraft, VenueDraft } from "@/lib/branch-types";

function venue(partial: Pick<VenueDraft, "name" | "address" | "postcode" | "city" | "latitude" | "longitude">): VenueDraft {
  return {
    key: crypto.randomUUID(),
    name: partial.name,
    address: partial.address,
    addressLine2: "",
    city: partial.city,
    postcode: partial.postcode,
    country: "United Kingdom",
    latitude: partial.latitude,
    longitude: partial.longitude,
    parkingInfo: "Public parking is available near the venue.",
    transitInfo: "The venue is reachable by public transport. Check local bus and rail times before you travel.",
    imageUrl: "",
    imageKey: "",
  };
}

function service(partial: Pick<ServiceDraft, "day" | "time" | "label">): ServiceDraft {
  return {
    key: crypto.randomUUID(),
    day: partial.day,
    time: partial.time,
    label: partial.label,
    venueIndex: 0,
  };
}

/** Sensible defaults for a new branch. Not named after a real campus. */
export function branchTemplate(current: BranchDraft): BranchDraft {
  return {
    ...current,
    city: current.city || "Sample City",
    shortDescription:
      current.shortDescription || "A local church family gathering around Jesus, the Word, and prayer.",
    description:
      current.description ||
      "Sunday worship and a midweek meeting. Replace this copy, the sample address, and the map pin before publishing.",
    venues: [
      venue({
        name: "Main hall",
        address: "1 Example Street",
        postcode: "AB1 2CD",
        city: "Sample City",
        latitude: "51.5074",
        longitude: "-0.1278",
      }),
      venue({
        name: "Side room",
        address: "1 Example Street",
        postcode: "AB1 2CD",
        city: "Sample City",
        latitude: "",
        longitude: "",
      }),
    ],
    services: [
      service({ day: "Sunday", time: "10:00", label: "Sunday service" }),
      service({ day: "Thursday", time: "19:00", label: "Midweek service" }),
    ],
  };
}
