import { Gap } from './gap';

/**
 * Booking Summary — 342×356.
 *
 * Figma component doc (2:2045): "What is being agreed, in plain terms.
 * Reused on Checkout, Confirmation, Booking Detail and the host's Booking
 * Request card — four surfaces, which is why this is a component rather than
 * composed text. Carries the group cap explicitly: §13 rates hidden group
 * size as a HIGH-severity pain on most bookings."
 */
export interface SummaryRow {
  label: string;
  value: string;
}

export function BookingSummary({ rows }: { rows: SummaryRow[] }) {
  return (
    <dl className="bg-surface-raised flex w-full flex-col items-start p-4">
      {rows.map((row, index) => (
        <div key={row.label} className="w-full">
          {index > 0 ? <Gap size={12} /> : null}
          <dt className="type-platform-label text-text-secondary w-full">
            {row.label}
          </dt>
          <Gap size={4} />
          <dd className="type-platform-body text-text-primary w-full">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
