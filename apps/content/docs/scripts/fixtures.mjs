/**
 * Demo rows served in place of real studio data while capturing screenshots, so no
 * visitor, message, subscriber or account details end up in the published docs.
 * Branches and department videos stay real: they are already public on the websites.
 */

export const DEMO_EMAIL = "daniel.boateng@kharis.org";

const DAY = 24 * 60 * 60 * 1000;

function at(now, days, hours = 10, minutes = 0) {
  const date = new Date(now.getTime() + days * DAY);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

function dateOnly(now, days) {
  const date = new Date(now.getTime() + days * DAY);
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** The previous given weekday at a time, so weekly events start in the past like real ones. */
function lastWeekday(now, weekday, hours, minutes = 0) {
  const date = new Date(now);
  date.setDate(date.getDate() - ((date.getDay() - weekday + 7) % 7) - 7);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

export function buildFixtures({ branches, now = new Date() }) {
  const pick = (index) => branches[index % Math.max(branches.length, 1)] ?? { id: null, name: "" };
  const [b0, b1, b2] = [pick(0), pick(1), pick(2)];

  const event = (row) => ({
    description: null,
    location: null,
    end_time: null,
    recurrence: "none",
    recurrence_days: [],
    recurrence_until: null,
    is_featured: false,
    image_url: null,
    category: "general",
    ...row,
  });

  const events = [
    event({
      id: "ev-1",
      title: "Sunday Service",
      branch_id: b0.id,
      branch_name: b0.name,
      start_time: lastWeekday(now, 0, 10),
      end_time: lastWeekday(now, 0, 12),
      category: "service",
      recurrence: "weekly",
      recurrence_days: [0],
      sites: ["kharis", "app"],
      workspace: "kharis",
    }),
    event({
      id: "ev-2",
      title: "Midweek Service",
      branch_id: b0.id,
      branch_name: b0.name,
      start_time: lastWeekday(now, 3, 19),
      category: "service",
      recurrence: "weekly",
      recurrence_days: [3],
      sites: ["kharis", "app"],
      workspace: "kharis",
    }),
    event({
      id: "ev-3",
      title: "Night of Worship",
      branch_id: b1.id,
      branch_name: b1.name,
      start_time: at(now, 6, 19, 30),
      category: "general",
      sites: ["kharis", "kp2", "app"],
      is_featured: true,
      workspace: "kharis",
    }),
    event({
      id: "ev-4",
      title: "Baptism Sunday",
      branch_id: b2.id,
      branch_name: b2.name,
      start_time: at(now, 10, 11),
      category: "service",
      sites: ["kharis"],
      workspace: "kharis",
    }),
    event({
      id: "ev-5",
      title: "Leaders' Retreat",
      branch_id: null,
      branch_name: null,
      location: "To be confirmed",
      start_time: at(now, 24, 9),
      category: "camp",
      sites: [],
      workspace: "kharis",
    }),
    event({
      id: "ev-6",
      title: "Grace Conference",
      branch_id: null,
      branch_name: null,
      location: "All campuses",
      start_time: at(now, 18, 18),
      category: "conference",
      sites: ["kharis", "kp2", "app"],
      is_featured: true,
      workspace: "kharis",
    }),
    event({
      id: "ev-7",
      title: "KP2 Youth Night",
      branch_id: b0.id,
      branch_name: b0.name,
      start_time: at(now, 4, 19),
      category: "fellowship",
      sites: ["kp2"],
      workspace: "kp2",
    }),
    event({
      id: "ev-8",
      title: "Prayer Breakfast",
      branch_id: b1.id,
      branch_name: b1.name,
      start_time: at(now, 8, 8, 30),
      category: "fellowship",
      sites: ["app"],
      workspace: "app",
    }),
  ];

  const message = (row) => ({ phone: null, branch_id: null, branch_name: null, ...row });
  const contact_messages = [
    message({
      id: "msg-1",
      first_name: "Ama",
      last_name: "Mensah",
      email: "ama.mensah@example.com",
      phone: "07700 900123",
      topic: "Prayer request",
      branch_id: b0.id,
      branch_name: b0.name,
      message:
        "From: Main site\n\nCould the prayer team pray for my mum? She has a hospital appointment on Thursday and we are trusting God for a good report. Thank you.",
      workspace: "kharis",
      status: "new",
      created_at: at(now, 0, now.getHours() - 1),
    }),
    message({
      id: "msg-2",
      first_name: "Joshua",
      last_name: "Adeyemi",
      email: "j.adeyemi@example.com",
      topic: "Joining a department",
      branch_name: b1.name,
      branch_id: b1.id,
      message:
        "From: KP2\n\nHi, I'd love to serve with the media team. I have some experience with cameras and editing. Who should I speak to?",
      workspace: "kp2",
      status: "new",
      created_at: at(now, 0, now.getHours() - 3),
    }),
    message({
      id: "msg-3",
      first_name: "Grace",
      last_name: "Owusu",
      email: "grace.owusu@example.com",
      topic: "Baby dedication",
      message:
        "From: Main site\n\nWe would like to dedicate our daughter next month. Is there a date we can book, and is there anything we need to bring?",
      workspace: "kharis",
      status: "read",
      created_at: at(now, -1, 14),
    }),
    message({
      id: "msg-4",
      first_name: "Samuel",
      last_name: "Kofi",
      email: "samuel.k@example.com",
      topic: "General enquiry",
      branch_name: b2.name,
      branch_id: b2.id,
      message:
        "From: Main site\n\nWhat time does the Sunday service finish? Planning to bring my family this week.",
      workspace: "kharis",
      status: "read",
      created_at: at(now, -3, 11),
    }),
    message({
      id: "msg-5",
      first_name: "Priscilla",
      last_name: "Danso",
      email: "p.danso@example.com",
      topic: "Feedback",
      message: "From: KP2\n\nThank you for last Friday's youth night. It was a blessing!",
      workspace: "kp2",
      status: "archived",
      created_at: at(now, -9, 20),
    }),
  ];

  const visitors = [
    {
      id: "vis-1",
      name: "Ruth Appiah",
      email: "ruth.appiah@example.com",
      phone: "07700 900456",
      branch_name: b0.name,
      message: "Site: Main site\nGathering: Sunday Service\nMay contact: yes",
      created_at: at(now, -1, 9),
    },
    {
      id: "vis-2",
      name: "Daniel Okafor",
      email: "d.okafor@example.com",
      phone: null,
      branch_name: b1.name,
      message: "Site: KP2\nGathering: KP2 Youth Night\nMay contact: yes",
      created_at: at(now, -2, 18),
    },
    {
      id: "vis-3",
      name: "Hannah Boadu",
      email: "hannah.b@example.com",
      phone: null,
      branch_name: b2.name,
      message: "Site: Main site\nGathering: Midweek Service\nMay contact: no",
      created_at: at(now, -4, 12),
    },
    {
      id: "vis-4",
      name: "Michael Asante",
      email: "m.asante@example.com",
      phone: "07700 900789",
      branch_name: b0.name,
      message: "Site: Main site\nGathering: Sunday Service\nMay contact: yes",
      created_at: at(now, -6, 16),
    },
  ];

  const newsletter_subscribers = [
    ["sub-1", "esther.k@example.com", "kp2", -1],
    ["sub-2", "kwabena.o@example.com", "kharis", -2],
    ["sub-3", "abigail.n@example.com", "kharis", -4],
    ["sub-4", "theo.mensah@example.com", "kp2", -5],
    ["sub-5", "linda.a@example.com", "kharis", -8],
    ["sub-6", "isaac.b@example.com", "kp2", -12],
    ["sub-7", "naomi.d@example.com", "kharis", -15],
  ].map(([id, email, source, days]) => ({ id, email, source, created_at: at(now, days, 13) }));

  const news = [
    {
      id: "news-1",
      workspace: "kharis",
      title: "Christmas service times",
      body: "Join us for carols, Christmas Eve and Christmas Day services across every campus.",
      image: null,
      published: true,
      created_at: at(now, -1),
    },
    {
      id: "news-2",
      workspace: "kharis",
      title: "Baptism registration is open",
      body: "If you have given your life to Christ and want to be baptised, register at the welcome desk.",
      image: null,
      published: true,
      created_at: at(now, -6),
    },
    {
      id: "news-3",
      workspace: "kharis",
      title: "New volunteers' induction",
      body: "Draft: dates to be confirmed with the departments.",
      image: null,
      published: false,
      created_at: at(now, -10),
    },
    {
      id: "news-4",
      workspace: "app",
      title: "Download the sermon notes",
      body: "Sermon notes are now in the app after every Sunday service.",
      image: null,
      published: true,
      created_at: at(now, -2),
    },
  ];

  const testimony = (row) => ({
    short_description: null,
    description: null,
    image_url: null,
    is_anonymous: false,
    is_featured: false,
    is_featured_giving: false,
    is_published: true,
    workspace: "kharis",
    ...row,
  });
  const testimonies = [
    testimony({
      id: "t-1",
      name: "Abena Ofori",
      branch_name: b0.name,
      category: "Healing",
      short_description: "Doctors were preparing for surgery. The scan came back clear.",
      is_featured: true,
    }),
    testimony({
      id: "t-2",
      name: "Anonymous",
      branch_name: b1.name,
      category: "Provision",
      short_description: "Rent was due and there was nothing in the account. God provided.",
      is_anonymous: true,
      is_featured_giving: true,
    }),
    testimony({
      id: "t-3",
      name: "Kojo Mensah",
      branch_name: b2.name,
      category: "Salvation",
      short_description: "I came to a Sunday service to please a friend and left a new man.",
    }),
    testimony({
      id: "t-4",
      name: "Efua Asare",
      branch_name: b0.name,
      category: "Breakthrough",
      short_description:
        "After two years of applications, the job offer came the week after fasting.",
      is_published: false,
    }),
  ];

  const sermons = [
    ["s-1", "Walking in Grace", "Pastor Samuel Adjei", -3, "Grace"],
    ["s-2", "The Faith That Speaks", "Pastor Ama Ofori", -10, "Faith"],
    ["s-3", "Rooted and Built Up", "Pastor Samuel Adjei", -17, "Foundations"],
    ["s-4", "A House of Prayer", "Guest Speaker", -24, null],
    ["s-5", "Kingdom Generosity", "Pastor Ama Ofori", -31, "Giving"],
  ].map(([id, title, speaker, days, series], index) => ({
    id,
    title,
    speaker,
    date: dateOnly(now, days),
    series,
    description: null,
    video_url: "https://www.youtube.com/watch?v=demo",
    audio_url: null,
    thumbnail: null,
    published: index !== 3,
  }));

  const daily = (id, kind, days, title, reference, body) => ({
    id,
    workspace: "app",
    kind,
    date: dateOnly(now, days),
    title,
    reference,
    body,
  });
  const daily_entries = [
    daily(
      "d-1",
      "reading",
      0,
      "The Good Shepherd",
      "John 10:1-18",
      "Jesus knows his sheep by name.",
    ),
    daily("d-2", "reading", 1, "Life in the Spirit", "Romans 8:1-11", null),
    daily("d-3", "reading", 2, "The Lord Is My Shepherd", "Psalm 23", null),
    daily("d-4", "reading", 3, "Faith That Works", "James 2:14-26", null),
    daily("d-5", "reading", -1, "Love Is Patient", "1 Corinthians 13", null),
    daily(
      "p-1",
      "prayer",
      0,
      "For our city",
      "Jeremiah 29:7",
      "Pray for peace and the welfare of the city.",
    ),
    daily(
      "p-2",
      "prayer",
      1,
      "For families",
      "Joshua 24:15",
      "Pray for every household in the church.",
    ),
    daily(
      "p-3",
      "prayer",
      2,
      "For new believers",
      "Colossians 2:6-7",
      "Pray they are rooted and built up.",
    ),
  ];

  const catalogue = [
    {
      id: "cat-1",
      title: "Walking in Grace",
      speaker: "Pastor Samuel Adjei",
      date: dateOnly(now, -3),
      scripture: "Ephesians 2:8-10",
      series: "Grace",
    },
    {
      id: "cat-2",
      title: "Grace for Every Season",
      speaker: "Pastor Ama Ofori",
      date: dateOnly(now, -40),
      scripture: "2 Corinthians 12:9",
      series: "Grace",
    },
    {
      id: "cat-3",
      title: "The Faith That Speaks",
      speaker: "Pastor Ama Ofori",
      date: dateOnly(now, -10),
      scripture: "Mark 11:22-24",
      series: "Faith",
    },
    {
      id: "cat-4",
      title: "Rooted and Built Up",
      speaker: "Pastor Samuel Adjei",
      date: dateOnly(now, -17),
      scripture: "Colossians 2:6-7",
      series: "Foundations",
    },
    {
      id: "cat-5",
      title: "Amazing Grace",
      speaker: "Guest Speaker",
      date: dateOnly(now, -60),
      scripture: "Titus 2:11",
      series: "",
    },
  ];

  const daily_messages = [
    {
      id: "dm-1",
      date: dateOnly(now, 0),
      sermon_id: "cat-1",
      note: "Share with the morning devotion group.",
    },
    { id: "dm-2", date: dateOnly(now, 1), sermon_id: "cat-3", note: null },
    { id: "dm-3", date: dateOnly(now, 2), sermon_id: "cat-4", note: null },
    { id: "dm-4", date: dateOnly(now, -1), sermon_id: "cat-2", note: null },
  ];

  const featured_videos = [
    {
      id: "fv-1",
      workspace: "kharis",
      title: "Welcome to Kharis Church",
      video_url: "https://www.youtube.com/watch?v=welcome",
      published: true,
    },
    {
      id: "fv-2",
      workspace: "kharis",
      title: "Christmas at Kharis",
      video_url: "https://www.youtube.com/watch?v=christmas",
      published: false,
    },
  ];

  const app_config = [
    {
      key: "live_stream",
      value: {
        url: "https://www.youtube.com/@kharischurch/live",
        is_live: false,
        title: "Sunday Service Live",
      },
    },
  ];

  const users = [
    {
      id: "u-1",
      email: DEMO_EMAIL,
      role: "super_admin",
      branchIds: [],
      createdAt: at(now, -200),
      lastSignInAt: at(now, 0, now.getHours()),
    },
    {
      id: "u-2",
      email: "comms@kharis.org",
      role: "super_admin",
      branchIds: [],
      createdAt: at(now, -150),
      lastSignInAt: at(now, -2, 9),
    },
    {
      id: "u-3",
      email: "london.admin@kharis.org",
      role: "branch_admin",
      branchIds: [b0.id].filter(Boolean),
      createdAt: at(now, -90),
      lastSignInAt: at(now, -1, 19),
    },
    {
      id: "u-4",
      email: "regional.admin@kharis.org",
      role: "branch_admin",
      branchIds: [b1.id, b2.id].filter(Boolean),
      createdAt: at(now, -40),
      lastSignInAt: at(now, -6, 8),
    },
    {
      id: "u-5",
      email: "new.volunteer@kharis.org",
      role: "none",
      branchIds: [],
      createdAt: at(now, -1),
      lastSignInAt: null,
    },
  ];

  return {
    tables: {
      events,
      contact_messages,
      visitors,
      newsletter_subscribers,
      news,
      testimonies,
      sermons,
      daily_entries,
      daily_messages,
      featured_videos,
      app_config,
    },
    users,
    catalogue,
  };
}

/** Applies the studio's { column: value | value[] } filter. */
export function matches(row, where = {}) {
  return Object.entries(where).every(([column, expected]) => {
    const actual = row[column];
    if (Array.isArray(expected)) return expected.includes(actual);
    if (expected === null) return actual === null || actual === undefined;
    return actual === expected;
  });
}
