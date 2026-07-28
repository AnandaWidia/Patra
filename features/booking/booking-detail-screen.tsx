'use client';

import { ActionControl, TextLink } from '@/components/ui/action-control';
import { Gap } from '@/components/ui/gap';
import { StatusBand } from '@/components/ui/status-band';
import {
  Body,
  Display,
  HostBody,
  Label,
  Lede,
  Meta,
  Title,
} from '@/components/ui/typography';

/**
 * Your Booking — Figma 2:2949, and its offline variant 2:2979.
 *
 * §03 — must render fully offline; highest offline priority.
 * §08 — offline is FULL here, the only surface rated that way.
 * §15 — Your Booking renders completely with the network disabled, which is
 * why every value on it is static content rather than a fetch.
 *
 * The two frames differ only in the status band (§03), so `offline` swaps the
 * band rather than duplicating the screen.
 */
export function BookingDetailScreen({
  offline = false,
}: {
  offline?: boolean;
}) {
  return (
    <>
      {offline ? (
        <StatusBand
          tone="offline"
          label="NO SIGNAL"
          note="This is your saved copy. Nothing on this page needs a connection."
        />
      ) : (
        <StatusBand
          tone="saved"
          label="SAVED TO THIS PHONE"
          note="Everything below works without a connection. Mas has patchy reception."
        />
      )}
      <Gap size={48} />

      <Label>THURSDAY 18 JUNE</Label>
      <Gap size={8} />
      {/* §05 — host/display: the Your Booking time is one of its two uses. */}
      <Display>Nine in the morning</Display>
      <Gap size={16} />
      <Title as="p">with I Made Suarta</Title>
      <Gap size={48} />

      <Label>WHERE</Label>
      <Gap size={8} />
      <Lede as="address" className="not-italic">
        Banjar Mas, Jalan Raya Mas
        <br />
        Gianyar, Bali
      </Lede>
      <Gap size={12} />
      <Body className="text-text-secondary">
        The compound with the two carved doors, forty metres past the temple on
        the left. There is no sign.
      </Body>
      <Gap size={48} />

      <Label>IF YOU CANNOT FIND IT</Label>
      <Gap size={12} />
      <ActionControl href="tel:+6281234567890">+62 812 3456 7890</ActionControl>
      <Gap size={8} />
      <Meta className="text-center">His number. He answers it himself.</Meta>
      <Gap size={48} />

      <Label>WHAT I MADE ASKED YOU TO BRING</Label>
      <Gap size={12} />
      <HostBody>
        Nothing. Wear something you do not mind getting dust on, and cover your
        knees — the workshop is inside the family compound and the shrine is in
        the same courtyard.
      </HostBody>
      <Gap size={48} />

      <TextLink className="text-text-secondary">Cancel or reschedule</TextLink>
    </>
  );
}
