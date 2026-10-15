/** KP2 lives at kharis.org/kp2. Override with NEXT_PUBLIC_KP2_URL to test against another build. */
export const KP2_URL = process.env.NEXT_PUBLIC_KP2_URL || "https://kharis.org/kp2";

/** A KP2 branch's page on the KP2 site, which uses the same slugs ("kp2-london"). */
export const kp2BranchUrl = (slug: string) => `${KP2_URL}/branches/${slug}`;
