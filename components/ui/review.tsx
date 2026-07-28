import { Gap } from './gap';

/**
 * Review — 342×116.
 *
 * Figma component doc (2:2212): "One review, booking-gated. The traveller's
 * own words are set in the serif because they authored them — AM-02 governs
 * by authorship, not by whether the writer is a host. Attribution and the
 * attendance record are platform metadata and stay in the sans. No star
 * rating and no score. §23 names generic praise as the failure signal rather
 * than the success one — so the component is built to carry specific
 * sentences, including critical ones."
 */
interface ReviewProps {
  attribution: string;
  body: string;
  attendance: string;
}

export function Review({ attribution, body, attendance }: ReviewProps) {
  return (
    <article className="flex w-full flex-col items-start">
      {/* §11 — attribution announced before the content it attributes. */}
      <p className="type-platform-label text-text-secondary w-full">
        {attribution}
      </p>
      <Gap size={12} />
      <p className="type-host-body text-text-primary w-full">{body}</p>
      <Gap size={12} />
      <p className="type-platform-meta text-text-secondary w-full">
        {attendance}
      </p>
    </article>
  );
}
