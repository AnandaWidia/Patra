'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { ActionControl } from '@/components/ui/action-control';
import { BookingSummary } from '@/components/ui/booking-summary';
import { ChoiceRow } from '@/components/ui/choice-row';
import { Gap } from '@/components/ui/gap';
import { PhotographPlaceholder } from '@/components/ui/photograph-placeholder';
import { RevenueSplitBlock } from '@/components/ui/revenue-split-block';
import { Body, HostBody, Label, Meta, Title } from '@/components/ui/typography';
import { ROUTES } from '@/constants/routes';
import { useBooking } from '@/contexts/booking-context';
import { usePaymentRails } from '@/lib/hooks/use-patra-data';
import { createGuestBooking } from '@/lib/services/guest';

export const CHECKOUT_SUMMARY = [
  { label: 'DATE', value: 'Thursday 18 June 2026' },
  { label: 'TIME', value: 'Nine in the morning' },
  { label: 'DURATION', value: 'Four hours' },
  { label: 'YOUR PARTY', value: 'Two people' },
  { label: 'OTHERS ATTENDING', value: 'Three people. Six people, never more.' },
  { label: 'WHERE', value: 'I Made’s compound · Mas, Gianyar' },
];

/**
 * Checkout — Figma 2:2557.
 * §03 — the split is a line item, always visible.
 * §15 — the 80% figure is never collapsed behind a disclosure.
 *
 * §02 — "Authentication never blocks booking. Guest checkout is a frozen
 * product decision: no password is required to book." Confirming writes an
 * unclaimed booking: no session, no account, and no identity fields, because
 * the frozen frame has none. The booking is addressed by an unguessable
 * claim token which the browser keeps until the traveller decides whether to
 * set a password. Set a Password is where the email is finally supplied — it
 * already has that field.
 *
 * Payment Method reuses Choice Row. The Figma doc for Payment Method (2:2069)
 * records the duplication as candidate amendment CA-04, and §14 requires its
 * off-scale 2px label gap to be rounded to 4px — which is exactly Choice Row's
 * geometry. Correcting the deviation collapses the two into one component.
 */
export function CheckoutScreen({ experienceId }: { experienceId: string }) {
  const router = useRouter();
  const { draft, setDraft } = useBooking();
  const { data: paymentMethods } = usePaymentRails();
  const selected = draft.paymentMethodId ?? 'pm-qris';

  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const confirm = () => {
    setError(null);
    startTransition(async () => {
      try {
        await createGuestBooking({
          experienceSlug: experienceId,
          day: draft.date ?? '2026-06-18',
          dateLabel: 'THURSDAY 18 JUNE',
          timeLabel: 'Nine in the morning',
          partySize: draft.partySize ?? 2,
          total: 750000,
          hostShare: 600000,
          paymentMethod: selected,
        });
        router.push(ROUTES.confirmation(experienceId));
      } catch (cause) {
        // §08 — never voice/refusal. State what happened, and that nothing
        // was charged, then offer the way forward.
        setError(
          cause instanceof Error
            ? cause.message
            : 'That did not go through. Nothing was charged.'
        );
      }
    });
  };

  return (
    <>
      <PhotographPlaceholder
        photo="checkout-hero"
        subject="EXP-004 · hands, chisel, unfinished wood"
      />
      <Gap size={24} />

      <Label>YOU ARE AGREEING TO A VISIT</Label>
      <Gap size={12} />
      <Title>I Made Suarta</Title>
      <Gap size={8} />
      <HostBody>
        He knows you are coming once you confirm. He will write to you himself,
        usually within a few hours.
      </HostBody>
      <Gap size={24} />

      <Label>WHAT YOU ARE AGREEING TO</Label>
      <Gap size={12} />
      <BookingSummary rows={CHECKOUT_SUMMARY} />
      <Gap size={24} />

      {/* Form=Line — figures only. The justification belongs on Experience
          Detail; §41 requires a line item, not the argument twice. */}
      <RevenueSplitBlock
        label="WHERE YOUR MONEY GOES"
        figures="Rp375.000 per person × 2 = Rp750.000. Of that total, Rp600.000 goes directly to his household."
      />
      <Gap size={16} />
      <Gap size={48} />

      <Label>HOW YOU WOULD LIKE TO PAY</Label>
      <Gap size={12} />
      {paymentMethods.map((method, index) => (
        <div key={method.id} className="w-full">
          {index > 0 ? <Gap size={8} /> : null}
          <ChoiceRow
            name="payment-method"
            label={method.label}
            meta={
              selected === method.id
                ? `Selected · ${method.detail}`
                : method.detail
            }
            selected={selected === method.id}
            onSelect={() => setDraft({ paymentMethodId: method.id })}
          />
        </div>
      ))}
      <Gap size={24} />

      <Label>IF YOU CANNOT COME</Label>
      <Gap size={4} />
      <Body>
        Cancel more than three days before and you are refunded in full. Closer
        than that, I Made has already bought the wood.
      </Body>
      <Gap size={24} />

      <ActionControl onClick={confirm} disabled={pending}>
        {pending ? 'Confirming' : 'Confirm and pay'}
      </ActionControl>

      {error ? (
        <>
          <Gap size={12} />
          <Meta role="alert">{error}</Meta>
        </>
      ) : null}

      <Gap size={16} />
      <Meta className="text-center">
        Nothing is charged until you confirm. The figures above are the ones on
        your receipt — they do not change.
      </Meta>
    </>
  );
}
