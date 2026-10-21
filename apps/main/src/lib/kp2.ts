/** Use the current KP2 app until the kharis.org/kp2 cutover. Override with NEXT_PUBLIC_KP2_URL. */
export const KP2_URL =
  process.env.NEXT_PUBLIC_KP2_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3001/kp2"
    : "https://kharis-kp2.itadmin-a94.workers.dev/kp2");

/** A KP2 branch's page on the KP2 site, which uses the same slugs ("kp2-london"). */
export const kp2BranchUrl = (slug: string) => `${KP2_URL}/branches/${slug}`;
