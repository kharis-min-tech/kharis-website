export const BANK = {
  accountName: "Kharis Ministries",
  accountNumber: "80608335",
  sortCode: "20-71-82",
  swift: "BUKBGB22",
  iban: "GB88BUKB20718280608335",
} as const;

export const ONLINE_GIVE_URL = "https://kharis.org/giving/";

const tithely = (formId: string) => `https://give.tithe.ly/?formId=${formId}`;

/** Branch giving pages used until Content Studio stores a link for that slug. */
const KP2_BRANCH_GIVING: Record<string, string> = {
  "kp2-barking": tithely("f5809c09-eacf-475a-a31c-5b722718f237"),
  "kp2-birmingham": tithely("1fb872e2-0696-4bef-9a95-36d61a3512cf"),
  "kp2-london": tithely("1f9358c0-6226-4abf-a526-4ef17e002c2f"),
  "kp2-peterborough": tithely("5a5d795a-ec95-480b-b047-8fee14c04789"),
  "kp2-romford": tithely("9bb02537-fd92-492a-bb76-3f2989c16c9d"),
  "kp2-southampton": tithely("a79fdf6d-6849-4751-95ba-dd248b953ea5"),
};

/** Content Studio's giving link wins. Only https addresses are used. */
export function resolveGivingLink(slug: string, stored: string | null | undefined) {
  const url = stored?.trim();
  if (url && /^https:\/\//i.test(url)) return url;
  return KP2_BRANCH_GIVING[slug] ?? null;
}
export const APP_STORE_URL = "https://apps.apple.com/";
export const PLAY_STORE_URL = "https://play.google.com/store";
export const SMS_GIVE = {
  keyword: "KCGIVE",
  number: "70085",
} as const;
