import { Gap } from './gap';
import { cn } from '@/lib/cn';

/**
 * Availability Week — 342×116.
 *
 * Figma component doc (2:2009): "Seven-cell week strip. Closed days carry
 * voice/refusal on the date and the cross marker, always accompanied by the
 * written reason beneath — colour never alone, per §41. This is the scope
 * AM-01 narrowed the token to: category signalling in dense data, never
 * narrative voice in prose. Cells are 56px, clearing the 44px target."
 *
 * §14 — this component carries 2px values that are off the spacing scale.
 * They are rounded up to 4px here as the handoff instructs, rather than
 * reproduced.
 */
export interface WeekDay {
  weekday: string;
  date: number;
  open: boolean;
}

interface AvailabilityWeekProps {
  label: string;
  days: WeekDay[];
  note: string;
}

export function AvailabilityWeek({ label, days, note }: AvailabilityWeekProps) {
  return (
    <section className="flex w-full flex-col items-start">
      <h3 className="type-platform-label text-text-secondary w-full">
        {label}
      </h3>
      <Gap size={12} />

      <ul className="flex w-full items-start gap-1">
        {days.map((day) => (
          <li
            key={`${day.weekday}-${day.date}`}
            className={cn(
              'rounded-control flex h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 py-2 text-center',
              day.open && 'border-boundary-interactive border'
            )}
          >
            <span className="type-platform-label text-text-secondary w-full">
              {day.weekday}
            </span>
            <span
              className={cn(
                'type-platform-body w-full',
                day.open ? 'text-text-primary' : 'text-voice-refusal'
              )}
            >
              {day.date}
            </span>
            {/* §11 — the marker is the non-chromatic half of the signal. */}
            <span
              className={cn(
                'type-platform-label w-full',
                day.open ? 'text-text-secondary' : 'text-voice-refusal'
              )}
            >
              {day.open ? '·' : '×'}
            </span>
          </li>
        ))}
      </ul>

      <Gap size={12} />
      <p className="type-platform-meta text-text-secondary w-full">{note}</p>
    </section>
  );
}
