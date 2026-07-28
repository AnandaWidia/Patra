import { Gap } from './gap';

/**
 * Verification Block — 342×128.
 *
 * §04 — label, fact, attribution. On surface/raised, 16px padding.
 * §05 — surfaces are square; the 4px radius token applies to controls only.
 * §11 — the attribution label must be announced before the content it
 * attributes, so the label is the first node and carries the heading role.
 */
interface VerificationBlockProps {
  label: string;
  fact: string;
  attribution: string;
}

export function VerificationBlock({
  label,
  fact,
  attribution,
}: VerificationBlockProps) {
  return (
    <section className="bg-surface-raised flex w-full flex-col items-start p-4">
      <h3 className="type-platform-label text-text-secondary w-full">
        {label}
      </h3>
      <Gap size={8} />
      <p className="type-platform-body text-text-primary w-full">{fact}</p>
      <Gap size={8} />
      <p className="type-platform-meta text-text-secondary w-full">
        {attribution}
      </p>
    </section>
  );
}
