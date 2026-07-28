'use client';

import { ActionControl } from '@/components/ui/action-control';
import { Gap } from '@/components/ui/gap';
import { HostBody, Label, Meta, Title } from '@/components/ui/typography';
import { ROUTES } from '@/constants/routes';

/**
 * My Bookings (Empty) — Figma 2:3395.
 * §03 — guides to the next meaningful action.
 * §08 — replaces the content region of My Bookings; the shell does not change.
 */
export function BookingsEmptyState() {
  return (
    <>
      <Label>YOUR BOOKINGS</Label>
      <Gap size={12} />
      <Title>Nothing booked yet.</Title>
      <Gap size={16} />
      <HostBody>
        When you book a day with someone, it sits here. It will still be here on
        the morning you need it, with no signal and no reception — which is the
        reason this page exists at all.
      </HostBody>
      <Gap size={48} />

      <ActionControl href={ROUTES.explore}>Explore experiences</ActionControl>
      <Gap size={16} />
      <Meta className="text-center">Three villages are open this week.</Meta>
    </>
  );
}
