'use client';

import { useRouter } from 'next/navigation';

import { ActionControl, TextLink } from '@/components/ui/action-control';
import { Gap } from '@/components/ui/gap';
import { HostBody, Label, Meta, Title } from '@/components/ui/typography';
import { useBooking } from '@/contexts/booking-context';

/**
 * Verify Identity — Figma 2:3449 "[COMPLETE] Camera Permission".
 *
 * §03 — states the benefit before requesting. Declining does not block
 * booking. §08 — a denied permission explains itself and does not block.
 */
export function VerifyIdentityScreen({
  experienceId,
}: {
  experienceId: string;
}) {
  const router = useRouter();
  const { setDraft } = useBooking();

  const decide = (verified: boolean) => {
    setDraft({ experienceId, identityVerified: verified });
    router.back();
  };

  return (
    <>
      <Label>BEFORE WE ASK</Label>
      <Gap size={12} />
      <Title>Why the camera.</Title>
      <Gap size={16} />
      <HostBody>
        You are going into somebody’s home, and they are letting a stranger
        through their gate. I Made was verified in person by his banjar before
        he could host anyone. You are verified here, by photographing one
        document.
      </HostBody>
      <Gap size={24} />

      <section className="bg-surface-raised flex w-full flex-col items-start p-4">
        <h3 className="type-platform-label text-text-secondary w-full">
          WHAT THE CAMERA IS USED FOR
        </h3>
        <Gap size={8} />
        <p className="type-platform-body text-text-primary w-full">
          One photograph of a passport or KTP. Once.
        </p>
        <Gap size={8} />
        {/* §09 — the host is shown that verification happened, never the
            document. That is what visibleToCounterparty encodes. */}
        <p className="type-platform-meta text-text-secondary w-full">
          It is not used again, it is never opened for anything else, and hosts
          are shown that you were verified — never the document itself.
        </p>
      </section>
      <Gap size={48} />

      <ActionControl onClick={() => decide(true)}>
        Allow the camera
      </ActionControl>
      <Gap size={16} />
      <TextLink onClick={() => decide(false)}>Not now</TextLink>
      <Gap size={24} />
      <Meta className="text-center">
        Choosing not now does not cancel anything. You can book, and verify
        before the host accepts.
      </Meta>
    </>
  );
}
