/** Visible marker for copy the children's team has not confirmed yet. Never ship facts we guessed. */
export function ConfirmBadge({ what, inline = false }: { what: string; inline?: boolean }) {
  const Tag = inline ? "span" : "p";

  return (
    <Tag className="kids-confirm">
      <span className="kids-confirm__tag">TODO: confirm with children&apos;s team</span>
      <span className="kids-confirm__what">{what}</span>
    </Tag>
  );
}
