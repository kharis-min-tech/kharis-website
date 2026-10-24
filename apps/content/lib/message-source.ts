/** Which public site sent a contact message. Older rows fall back to the inbox. */
export function messageSource(message: string, workspace: string) {
  const match = message.match(/^From:\s*(.+)$/im);
  const from = match?.[1]?.trim();
  if (from) return from;
  if (workspace === "kp2") return "KP2";
  if (workspace === "kharis") return "Main site";
  return "";
}
