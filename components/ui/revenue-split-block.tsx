import { Gap } from './gap';

/**
 * Revenue Split Block — 342×128.
 *
 * Figma component doc (2:2082): "The 80/20 split as a line item before
 * payment. Form=Full carries the justification and belongs on Experience
 * Detail, where the traveller meets the model for the first time. Form=Line
 * carries the figures only and belongs on Checkout — §41 requires a line
 * item, not the argument twice."
 *
 * §15 — the 80% line is never collapsed behind a disclosure.
 * §05 — voice/confirmation is the one accent permitted here: money reaching
 * a household.
 */
interface RevenueSplitBlockProps {
  label: string;
  /** The figures. Always visible, never behind a disclosure. */
  figures: string;
  /** Form=Full only — the justification. */
  justification?: string;
}

export function RevenueSplitBlock({
  label,
  figures,
  justification,
}: RevenueSplitBlockProps) {
  return (
    <section className="bg-surface-raised flex w-full flex-col items-start p-4">
      <h3 className="type-platform-label text-text-secondary w-full">
        {label}
      </h3>
      <Gap size={8} />
      <p className="type-platform-body text-voice-confirmation w-full">
        {figures}
      </p>
      {justification ? (
        <>
          <Gap size={8} />
          <p className="type-platform-meta text-text-secondary w-full">
            {justification}
          </p>
        </>
      ) : null}
    </section>
  );
}
