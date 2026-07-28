'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ActionControl } from '@/components/ui/action-control';
import {
  CalendarMonth,
  type CalendarDay,
} from '@/components/ui/calendar-month';
import { ChoiceRow } from '@/components/ui/choice-row';
import { Gap } from '@/components/ui/gap';
import { Body, HostBody, Label, Meta, Title } from '@/components/ui/typography';
import { ROUTES } from '@/constants/routes';
import { useBooking } from '@/contexts/booking-context';

/** June 2026 as the frozen frame sets it: 14–16 closed, 18 selected. */
const CLOSED = [14, 15, 16];

function buildJune(): CalendarDay[][] {
  const weeks: CalendarDay[][] = [];
  let day = 1;
  for (let w = 0; w < 5; w += 1) {
    const week: CalendarDay[] = [];
    for (let d = 0; d < 7; d += 1) {
      if (day > 30) {
        week.push({ day: null, state: 'blank' });
      } else {
        week.push({
          day,
          state: CLOSED.includes(day) ? 'closed' : 'open',
        });
        day += 1;
      }
    }
    weeks.push(week);
  }
  return weeks;
}

const PARTY_OPTIONS = [
  { size: 1, label: 'One person', price: 'Rp375.000' },
  { size: 2, label: 'Two people', price: 'Rp750.000' },
  { size: 3, label: 'Three people', price: 'Rp1.125.000' },
];

/**
 * Choose a Day — Figma 2:2913 "[COMPLETE] Date & Party Selection".
 * §03 — closed dates are non-interactive and carry a written reason.
 * §07 — back is safe here and must preserve entered data, which is why the
 * date and party size live in BookingContext rather than local state.
 */
export function ChooseDayScreen({ experienceId }: { experienceId: string }) {
  const router = useRouter();
  const { draft, setDraft } = useBooking();

  // The frame ships with 18 June and two people already chosen.
  useEffect(() => {
    if (draft.experienceId !== experienceId) {
      setDraft({ experienceId, date: '2026-06-18', partySize: 2 });
    }
  }, [draft.experienceId, experienceId, setDraft]);

  const selectedDay = draft.date ? Number(draft.date.slice(-2)) : 18;
  const partySize = draft.partySize ?? 2;

  return (
    <>
      <Label>CHOOSING A DAY WITH</Label>
      <Gap size={8} />
      <Title>I Made Suarta</Title>
      <Gap size={4} />
      <Meta>Carving in hibiscus wood · four hours · Mas, Gianyar</Meta>
      <Gap size={24} />

      <CalendarMonth
        monthLabel="JUNE 2026"
        monthName="June 2026"
        weeks={buildJune()}
        selectedDay={selectedDay}
        onSelect={(day) =>
          setDraft({ date: `2026-06-${String(day).padStart(2, '0')}` })
        }
      />
      <Gap size={16} />

      {/* §11 / AM-02 — the closure is community-authored and attributed, and
          the attribution is announced before the words. */}
      <Label>EXPLAINED BY BANJAR MAS, IN THEIR WORDS</Label>
      <Gap size={8} />
      <HostBody>
        The compound is closed on 14, 15 and 16 June. We are preparing offerings
        for Galungan and they take three days. Nobody in Mas is hosting on those
        days, and no one can open them.
      </HostBody>
      <Gap size={8} />
      <Body>Thursday 18 June selected.</Body>
      <Gap size={24} />

      <Label>HOW MANY OF YOU</Label>
      <Gap size={8} />
      <Body>
        Three people are already coming on the 18th. Six is the cap, so three
        places are left.
      </Body>
      <Gap size={12} />

      {PARTY_OPTIONS.map((option, index) => (
        <div key={option.size} className="w-full">
          {index > 0 ? <Gap size={8} /> : null}
          <ChoiceRow
            name="party-size"
            label={option.label}
            meta={
              partySize === option.size
                ? `Selected · ${option.price}`
                : option.price
            }
            selected={partySize === option.size}
            onSelect={() => setDraft({ partySize: option.size })}
          />
        </div>
      ))}
      <Gap size={24} />

      {/* §09 — Verification.visibleToCounterparty made concrete: the host is
          shown that the traveller was verified, never the document. */}
      <section className="bg-surface-raised flex w-full flex-col items-start p-4">
        <h3 className="type-platform-label text-text-secondary w-full">
          WHAT I MADE WILL SEE
        </h3>
        <Gap size={8} />
        <p className="type-platform-body text-text-primary w-full">
          Emma Whitfield · verified 24 June 2026
        </p>
        <Gap size={8} />
        <p className="type-host-body text-text-secondary w-full">
          He is told your name and that your identity was checked, nothing else.
          The banjar verified him in person and you are verified the same way —
          a household opening its gate should know as much about you as you know
          about them.
        </p>
      </section>
      <Gap size={24} />

      <ActionControl onClick={() => router.push(ROUTES.checkout(experienceId))}>
        Continue to checkout
      </ActionControl>
      <Gap size={16} />
      <Meta className="text-center">
        Nothing is charged yet. I Made accepts before you pay.
      </Meta>
    </>
  );
}
