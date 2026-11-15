import { fail, getSupabase } from "@/lib/supabase";
import { insertMedia } from "@/lib/media-repo";

export type DepartmentDefinition = {
  key: string;
  id: string;
  description: string;
};

export const DEPARTMENTS: DepartmentDefinition[] = [
  {
    key: "Administration",
    id: "00000000-0000-4000-8000-000000000001",
    description:
      "Supports others behind the scenes, ensuring everything runs smoothly and efficiently.",
  },
  {
    key: "Children's Department",
    id: "00000000-0000-4000-8000-000000000002",
    description:
      "Patient, nurturing, and joyful people who love teaching, encouraging, and inspiring children to grow in faith.",
  },
  {
    key: "Design",
    id: "00000000-0000-4000-8000-000000000003",
    description:
      "Innovative and artistic individuals who bring ideas to life visually, using creativity to communicate messages with excellence.",
  },
  {
    key: "Drama",
    id: "00000000-0000-4000-8000-000000000004",
    description:
      "Expressive, imaginative, and bold individuals who use storytelling and performance to communicate the gospel in powerful ways.",
  },
  {
    key: "Evangelism",
    id: "00000000-0000-4000-8000-000000000005",
    description:
      "Bold, outgoing, and confident individuals who love sharing the gospel and engaging others with compassion and courage.",
  },
  {
    key: "Follow Up",
    id: "00000000-0000-4000-8000-000000000006",
    description:
      "Caring, attentive, and relational individuals who enjoy guiding new believers, building trust, and encouraging spiritual growth.",
  },
  {
    key: "Guest Relations Team",
    id: "00000000-0000-4000-8000-000000000007",
    description:
      "Warm, attentive, and welcoming individuals who ensure every guest feels noticed, cared for, and connected from the moment they arrive.",
  },
  {
    key: "Hospitality",
    id: "00000000-0000-4000-8000-000000000008",
    description:
      "Warm, welcoming, and caring people who create an atmosphere of love and comfort for everyone they serve.",
  },
  {
    key: "Host Team",
    id: "00000000-0000-4000-8000-000000000009",
    description:
      "Friendly, approachable, and service-minded individuals who make everyone feel seen, valued, and at home.",
  },
  {
    key: "K-Music",
    id: "00000000-0000-4000-8000-000000000010",
    description:
      "Creative, expressive, and passionate individuals who use their musical gifts to glorify God and lead others into His presence.",
  },
  {
    key: "Music",
    id: "00000000-0000-4000-8000-000000000011",
    description:
      "Passionate, skilled, and Spirit-filled individuals who use their gifts to lead others into worship and the presence of God.",
  },
  {
    key: "New Believers",
    id: "00000000-0000-4000-8000-000000000012",
    description:
      "Patient, supportive, and mentoring-minded people who love helping others understand faith and grow spiritually.",
  },
  {
    key: "Photography",
    id: "00000000-0000-4000-8000-000000000013",
    description:
      "Observant, creative, and detail-focused individuals who capture moments that tell stories and inspire faith.",
  },
  {
    key: "Production",
    id: "00000000-0000-4000-8000-000000000014",
    description:
      "Diligent and detail-oriented individuals who ensure the smooth running of services through technical excellence and behind-the-scenes support.",
  },
  {
    key: "Sanctuary Keepers",
    id: "00000000-0000-4000-8000-000000000015",
    description:
      "Responsible, conscientious, and detail-focused people who take pride in maintaining a clean and orderly worship environment.",
  },
  {
    key: "Security",
    id: "00000000-0000-4000-8000-000000000016",
    description:
      "Alert, responsible, and protective individuals who prioritise safety and ensure a secure environment for others.",
  },
  {
    key: "Set-up",
    id: "00000000-0000-4000-8000-000000000017",
    description:
      "Hands-on, practical, and solution-oriented individuals who enjoy preparing spaces, managing logistics, and problem-solving.",
  },
  {
    key: "Social Media",
    id: "00000000-0000-4000-8000-000000000018",
    description:
      "Creative, tech-savvy, and communicative personalities who enjoy storytelling and engaging communities online.",
  },
  {
    key: "Sound",
    id: "00000000-0000-4000-8000-000000000019",
    description:
      "Technically-minded, attentive, and precise individuals who thrive on managing audio and creating seamless sound experiences.",
  },
  {
    key: "Spoken Word",
    id: "00000000-0000-4000-8000-000000000020",
    description:
      "Expressive and creative individuals who use poetry, spoken word, or performance art to inspire and communicate the gospel.",
  },
  {
    key: "Tech Team",
    id: "00000000-0000-4000-8000-000000000021",
    description:
      "Creative and detail-oriented individuals who use technology to create an atmosphere of excellence so people can encounter God freely.",
  },
  {
    key: "Uniform",
    id: "00000000-0000-4000-8000-000000000022",
    description:
      "Meticulous, disciplined, and detail-oriented people who value presentation, consistency, and high standards.",
  },
  {
    key: "Ushers",
    id: "00000000-0000-4000-8000-000000000023",
    description:
      "Friendly, approachable, and service-minded individuals who enjoy guiding, assisting, and caring for people in practical ways.",
  },
  {
    key: "Welfare",
    id: "00000000-0000-4000-8000-000000000024",
    description:
      "Compassionate, empathetic, and generous-hearted people who are motivated to help those in need and provide support.",
  },
];

const DEPT_BY_ID = new Map(DEPARTMENTS.map((dept) => [dept.id, dept.key]));

export async function listDepartmentVideos(): Promise<Record<string, string>> {
  const { data, error } = await getSupabase()
    .from("media")
    .select("owner_id, folder, url")
    .eq("owner_type", "department-video")
    .order("sort_order", { ascending: true });

  if (error) {
    if (error.code === "PGRST205") return {};
    throw new Error(error.message);
  }

  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    const key =
      (typeof row.folder === "string" && row.folder) ||
      (typeof row.owner_id === "string" && DEPT_BY_ID.get(row.owner_id)) ||
      "";
    const url = typeof row.url === "string" ? row.url.trim() : "";
    if (key && url && !map[key]) {
      map[key] = url;
    }
  }
  return map;
}

export async function saveDepartmentVideo(departmentKey: string, videoUrl: string) {
  const dept = DEPARTMENTS.find((item) => item.key === departmentKey);
  if (!dept) throw new Error(`Unknown department: ${departmentKey}`);

  const supabase = getSupabase();
  const trimmed = videoUrl.trim();
  const { data, error } = await supabase
    .from("media")
    .select("id")
    .eq("owner_type", "department-video")
    .eq("owner_id", dept.id)
    .order("sort_order", { ascending: true });

  if (error) {
    if (error.code === "PGRST205") return;
    throw new Error(error.message);
  }

  const existing = (data ?? []) as { id: string }[];

  if (!trimmed) {
    for (const row of existing) {
      const removed = await supabase.from("media").delete().eq("id", row.id);
      fail(removed.error);
    }
    return;
  }

  const [first, ...rest] = existing;
  if (first) {
    const updated = await supabase
      .from("media")
      .update({ url: trimmed, folder: dept.key, sort_order: 0 })
      .eq("id", first.id);
    fail(updated.error);
    for (const extra of rest) {
      const removed = await supabase.from("media").delete().eq("id", extra.id);
      fail(removed.error);
    }
    return;
  }

  await insertMedia({
    ownerType: "department-video",
    ownerId: dept.id,
    url: trimmed,
    folder: dept.key,
    sortOrder: 0,
  });
}
