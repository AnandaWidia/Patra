'use client';

import { useRouter } from 'next/navigation';

import { ActionControl, TextLink } from '@/components/ui/action-control';
import { Gap } from '@/components/ui/gap';
import { HostBody, Label, Meta, Title } from '@/components/ui/typography';
import { ROUTES } from '@/constants/routes';

/**
 * Checkout (Payment Failed) — Figma 2:3406.
 *
 * §08 error copy rule, binding: never use voice/refusal. Red in this product
 * means a village has closed its compound for a ceremony; a declined card is
 * not that. The screen states what happened, states that nothing was charged,
 * and offers recovery — which is why every colour here is text/primary and
 * text/secondary.
 */
export function PaymentFailedState({ experienceId }: { experienceId: string }) {
  const router = useRouter();

  return (
    <>
      <Label>NOT PAID</Label>
      <Gap size={12} />
      <Title>The payment did not go through.</Title>
      <Gap size={16} />
      <HostBody>
        Your bank declined it. Nothing has been charged, and Thursday is still
        open — nobody has taken it while you were here.
      </HostBody>
      <Gap size={24} />

      <section className="bg-surface-raised flex w-full flex-col items-start p-4">
        <h3 className="type-platform-label text-text-secondary w-full">
          WHAT WE WERE TOLD
        </h3>
        <Gap size={8} />
        <p className="type-platform-body text-text-primary w-full">
          Card ending 6411 · declined by the issuing bank
        </p>
        <Gap size={8} />
        <p className="type-platform-meta text-text-secondary w-full">
          We are not told why. Banks rarely say, and PATRA never sees more than
          this.
        </p>
      </section>
      <Gap size={48} />

      <ActionControl
        onClick={() => router.push(ROUTES.confirmation(experienceId))}
      >
        Try the same card again
      </ActionControl>
      <Gap size={16} />
      <TextLink href={ROUTES.checkout(experienceId)}>
        Use a different method
      </TextLink>
      <Gap size={24} />

      <Meta>
        Nothing on this page is a refusal. Red is reserved for a village closing
        its compound — a bank declining a card is not that.
      </Meta>
    </>
  );
}
