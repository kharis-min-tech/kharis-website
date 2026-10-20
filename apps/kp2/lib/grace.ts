import { listBranches, type Branch } from "@/lib/branches";

const PAGES = [
  ["Home", "/kp2"],
  ["Find a branch", "/kp2/branches"],
  ["Mission", "/kp2/mission"],
  ["Governance", "/kp2/governance"],
  ["Departments", "/kp2/departments"],
  ["Life", "/kp2/life"],
  ["Events", "/kp2/events"],
  ["Messages", "/kp2/messages"],
  ["Social media", "/kp2/media"],
  ["Give", "/kp2/giving"],
  ["Contact", "/kp2/contact"],
] as const;

function branchLine(branch: Branch) {
  const services = branch.serviceTimes
    .slice(0, 4)
    .map((service) => [service.day, service.time, service.label].filter(Boolean).join(" "))
    .filter(Boolean);
  const bits = [
    branch.name,
    branch.city && `(${branch.city})`,
    branch.address,
    services.length ? `Services: ${services.join("; ")}` : "",
    `Page: /kp2/branches/${branch.slug}`,
  ].filter(Boolean);
  return `- ${bits.join(" — ")}`;
}

export async function kp2Knowledge(): Promise<string> {
  let branches = "Live branch list unavailable. Send people to /kp2/branches.";
  try {
    const rows = await listBranches();
    if (rows.length) branches = rows.map(branchLine).join("\n");
  } catch {
    /* keep the fallback line */
  }

  return `# Kharis Phase 2
Kharis Phase 2 (KP2) is the youth and young-adults expression of Kharis Church. The public site is https://kharis.org/kp2.
Tagline: Changing the world with a touch of His grace.

## Pages
${PAGES.map(([label, href]) => `- ${label}: ${href}`).join("\n")}

## Branches
Suggest only the closest 1 to 3 matches, or the branch list. Do not list every branch unless asked.
${branches}
`;
}

export function kp2SystemPrompt(knowledge: string, page: string) {
  return `You are Grace, the AI assistant on the Kharis Phase 2 website. You are an AI, not a pastor or staff member. If asked, say so simply. Introduce yourself as "your assistant".

Voice: warm, plain, and brief. 1 to 3 short sentences. No headers. At most one question.
Use only the knowledge below for facts about KP2: branches, times, addresses, and pages. If it is not there, say so and offer /kp2/branches or /kp2/contact. Never invent times, addresses, or names.
When you point to a page, include one markdown link whose address starts with /kp2, for example [Find a branch](/kp2/branches).
For someone in immediate danger, tell them to contact local emergency services now, then offer [contact](/kp2/contact).
Stay on Kharis Phase 2, faith, and finding a place in the church. Politely redirect anything else in one sentence.
The person is currently on ${page}.

${knowledge}`;
}

export function cleanPage(value: unknown) {
  const page = String(value ?? "").trim();
  if (!page.startsWith("/") || page.startsWith("//") || page.includes("\n")) return "/kp2";
  const path = page.slice(0, 120);
  if (path === "/kp2" || path.startsWith("/kp2/")) return path;
  return path === "/" ? "/kp2" : `/kp2${path}`;
}
