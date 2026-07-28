import { Gap } from './gap';
import { cn } from '@/lib/cn';

/**
 * The status band at the head of Your Booking.
 *
 * §03 — the offline variant of Your Booking is "identical to parent except
 * the status band", which is why the band is the component and the screen is
 * not duplicated.
 *
 * §05 — surface/sunken is the offline band token; the saved band on the
 * online surface uses surface/raised.
 */
export function StatusBand({
  label,
  note,
  tone,
}: {
  label: string;
  note: string;
  tone: 'saved' | 'offline';
}) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-start px-4 py-3',
        tone === 'offline' ? 'bg-surface-sunken' : 'bg-surface-raised'
      )}
    >
      <p className="type-platform-label text-text-secondary w-full">{label}</p>
      <Gap size={4} />
      <p className="type-platform-meta text-text-secondary w-full">{note}</p>
    </div>
  );
}
