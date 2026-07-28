'use client';

import { ActionControl } from '@/components/ui/action-control';
import { BookingSummary } from '@/components/ui/booking-summary';
import { Gap } from '@/components/ui/gap';
import { PhotographPlaceholder } from '@/components/ui/photograph-placeholder';
import { Body, HostBody, Label, Meta, Title } from '@/components/ui/typography';
import { ROUTES } from '@/constants/routes';

import { CHECKOUT_SUMMARY } from './checkout-screen';

/**
 * Confirmation — Figma 2:2589.
 * §03 — post-payment relief. Carries nothing else: no suggestions, no
 * cross-sell. §08 — a terminal success state.
 *
 * The Photograph Placeholder is full bleed, so this screen supplies its own
 * padding rather than using the shell's.
 */
export function ConfirmationScreen() {
  return (
    <>
      <PhotographPlaceholder
        photo="confirmation-hero"
        subject="EXP-004 · Hero · hands, chisel, unfinished wood"
      />

      <div className="flex flex-col items-start px-6 pt-6 pb-12">
        <Label>CONFIRMED · PAID</Label>
        <Gap size={12} />
        <Title>I Made is expecting you.</Title>
        <Gap size={8} />
        <Body>
          Thursday 18 June, nine in the morning. He has been told there will be
          two of you.
        </Body>
        <Gap size={24} />

        <Label>YOUR RECORD OF THE DAY</Label>
        <Gap size={12} />
        <BookingSummary rows={CHECKOUT_SUMMARY} />
        <Gap size={16} />
        <Meta className="text-center">
          Of the Rp750.000 you paid, Rp600.000 goes directly to his household.
          It reaches him on 19 June, the day after you visit.
        </Meta>
        <Gap size={24} />

        <Label>WHAT HAPPENS NEXT</Label>
        <Gap size={12} />
        <HostBody>
          I Made will write to you himself, usually within a few hours and
          always within a day. He will tell you what to wear and what not to
          bring.
        </HostBody>
        <Gap size={16} />
        <Body className="text-text-secondary">
          If you have not heard from him by this time tomorrow, we will write on
          his behalf and then follow up with him. You will not be left
          wondering.
        </Body>
        <Gap size={24} />

        <Label>THIS PAGE WORKS WITHOUT SIGNAL</Label>
        <Gap size={4} />
        <Body>
          The address, the time and his number are saved to your phone. Mas has
          patchy reception and you will not need any.
        </Body>
        <Gap size={24} />

        <ActionControl href={ROUTES.messageThread('cv-01')}>
          Message I Made
        </ActionControl>
        <Gap size={16} />
        <HostBody className="text-center">
          He will be there at nine. He is always there at nine.
        </HostBody>
      </div>
    </>
  );
}
