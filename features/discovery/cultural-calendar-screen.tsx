'use client';

import { ActionControl } from '@/components/ui/action-control';
import { Gap } from '@/components/ui/gap';
import {
  Body,
  HostBody,
  Label,
  Lede,
  Meta,
  Title,
} from '@/components/ui/typography';
import { ROUTES } from '@/constants/routes';
import { useCalendarEvents } from '@/lib/hooks/use-patra-data';
import { cn } from '@/lib/cn';

/**
 * Cultural Calendar — Figma 2:3343.
 * §03 — read-only. Explicitly NOT a filter: no date controls.
 *
 * The status label takes voice/refusal when a village has closed its compound
 * and voice/confirmation when it is open or partial, exactly as the frozen
 * frame sets it. §11 — never colour alone: each status is also spelled out in
 * the label text (CLOSED / OPEN / PARTIAL).
 */
export function CulturalCalendarScreen() {
  const { data: calendar } = useCalendarEvents();

  return (
    <>
      <Label>CEREMONIAL CALENDAR</Label>
      <Gap size={12} />
      <Title>What is happening while you are here.</Title>
      <Gap size={16} />
      <HostBody>
        These days belong to the villages, not to PATRA. Some open the compound
        to visitors and some close it entirely. Neither can be booked around.
      </HostBody>
      <Gap size={48} />

      {calendar.map((event, index) => (
        <div key={event.id} className="w-full">
          {index > 0 ? <Gap size={48} /> : null}
          <Label
            className={cn(
              event.status === 'closed'
                ? 'text-voice-refusal'
                : 'text-voice-confirmation'
            )}
          >
            {event.statusLabel}
          </Label>
          <Gap size={8} />
          <Lede>{event.name}</Lede>
          <Gap size={12} />
          {event.attributedTo ? (
            <>
              {/* §11 — attribution announced before the words it attributes. */}
              <Label>{event.attributedTo}</Label>
              <Gap size={8} />
            </>
          ) : null}
          <HostBody>{event.explanation}</HostBody>
          <Gap size={12} />
          <Body>{event.availability}</Body>
        </div>
      ))}

      <Gap size={48} />
      <ActionControl href={ROUTES.explore}>See what is open</ActionControl>
      <Gap size={16} />
      <Meta>
        This is not a filter. Nothing here narrows a search — it tells you what
        the villages are doing, and you decide whether that is a reason to come.
      </Meta>
    </>
  );
}
