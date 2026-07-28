'use client';

import { Gap } from './gap';
import { cn } from '@/lib/cn';

/**
 * Calendar Month — 342×324.
 *
 * Figma component doc (2:2109): "Open days carry a boundary/interactive
 * border — an affordance, not a colour. Closed days carry no border and take
 * voice/refusal on the numeral, always accompanied by the written reason
 * beneath, which per AM-02 must be community-authored and attributed. Cells
 * are 48px, clearing the 44px target."
 *
 * §11 — the calendar cell is the one place voice/refusal is permitted, and
 * availability is carried by border presence rather than by hue.
 */
export type DayState = 'open' | 'closed' | 'selected' | 'blank';

export interface CalendarDay {
  day: number | null;
  state: DayState;
}

interface CalendarMonthProps {
  monthLabel: string;
  weeks: CalendarDay[][];
  selectedDay?: number | null;
  onSelect?: (day: number) => void;
  /** Spoken with each date so a numeral is never announced bare (§11). */
  monthName: string;
}

/**
 * §04 / §11 — cells are 45×48. The height is set explicitly because a Figma
 * stroke does not expand its frame but a CSS border does; padding alone
 * measured 49.6px. §11: "do not reduce it."
 */
const CELL =
  'flex h-12 min-w-0 flex-1 items-center justify-center rounded-control';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function CalendarMonth({
  monthLabel,
  weeks,
  selectedDay,
  onSelect,
  monthName,
}: CalendarMonthProps) {
  return (
    <div className="flex w-full flex-col items-start">
      <p className="type-platform-label text-text-secondary w-full">
        {monthLabel}
      </p>
      <Gap size={12} />

      <div className="flex w-full items-start gap-1" role="presentation">
        {WEEKDAYS.map((weekday, index) => (
          <div
            key={`${weekday}-${index}`}
            className="flex min-w-0 flex-1 flex-col items-center py-2"
          >
            <span className="type-platform-label text-text-secondary w-full text-center">
              {weekday}
            </span>
          </div>
        ))}
      </div>
      <Gap size={4} />

      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="w-full">
          {weekIndex > 0 ? <Gap size={4} /> : null}
          <div className="flex w-full items-start gap-1">
            {week.map((cell, cellIndex) => {
              const isSelected =
                cell.state === 'selected' ||
                (selectedDay != null && cell.day === selectedDay);

              if (cell.state === 'blank' || cell.day == null) {
                return (
                  <div key={cellIndex} aria-hidden="true" className={CELL} />
                );
              }

              if (cell.state === 'closed') {
                return (
                  <div
                    key={cellIndex}
                    aria-disabled="true"
                    aria-label={`${cell.day} ${monthName}, closed`}
                    role="gridcell"
                    className={CELL}
                  >
                    <span className="type-platform-body text-voice-refusal text-center">
                      {cell.day}
                    </span>
                  </div>
                );
              }

              return (
                <button
                  key={cellIndex}
                  type="button"
                  aria-pressed={isSelected}
                  // §11 — a bare numeral is meaningless read aloud.
                  aria-label={`${cell.day} ${monthName}`}
                  onClick={() => onSelect?.(cell.day as number)}
                  className={cn(
                    CELL,
                    isSelected
                      ? 'bg-surface-inverse'
                      : 'border-boundary-interactive border',
                    'focus-visible:outline-boundary-focus focus-visible:outline-2 focus-visible:outline-offset-2'
                  )}
                >
                  <span
                    className={cn(
                      'type-platform-body text-center',
                      isSelected ? 'text-surface-page' : 'text-text-primary'
                    )}
                  >
                    {cell.day}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <Gap size={4} />
    </div>
  );
}
