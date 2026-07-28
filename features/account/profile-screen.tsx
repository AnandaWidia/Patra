'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { ActionControl, TextLink } from '@/components/ui/action-control';
import { Gap } from '@/components/ui/gap';
import { Body, Label, Title } from '@/components/ui/typography';
import { VerificationBlock } from '@/components/ui/verification-block';
import { ROUTES } from '@/constants/routes';
import { useSession } from '@/contexts/session-context';
import { signOut as signOutAction } from '@/lib/auth/actions';

/** A label/value pair. Repeats three times on this surface. */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <>
      <Label>{label}</Label>
      <Gap size={4} />
      <Body>{value}</Body>
    </>
  );
}

/**
 * Profile — Figma 2:3252.
 * §03 — the sign out link switches to the signed-out state.
 *
 * §03 marks this surface's dynamic content as "User, verification, payment,
 * prefs", so the name is bound to the session rather than hardcoded. Without
 * Supabase the session serves the mock traveller and the screen reads exactly
 * as the frame does. Verification, payment and preferences stay mock: this
 * milestone is authentication only.
 */
export function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useSession();
  const [, startTransition] = useTransition();

  const onSignOut = () => {
    startTransition(async () => {
      await signOutAction();
      signOut();
      router.replace(ROUTES.profileSignedOut);
      router.refresh();
    });
  };

  return (
    <>
      <Label>YOUR PROFILE</Label>
      <Gap size={12} />
      <Title>{user.fullName}</Title>
      <Gap size={24} />

      <VerificationBlock
        label="VERIFIED"
        fact="Passport checked 24 June 2026"
        attribution="I Made saw this before he accepted your booking, and every host you book with will see the same. It is shown to them, not only held by us."
      />
      <Gap size={24} />

      <Field label="PAYMENT METHODS" value="QRIS · Card ending 6411" />
      <Gap size={16} />
      <Field
        label="NOTIFICATIONS"
        value="Booking updates and host messages only"
      />
      <Gap size={16} />
      <Field label="LANGUAGE" value="English · Bahasa Indonesia available" />
      <Gap size={16} />
      <Gap size={24} />

      <ActionControl>See what hosts see</ActionControl>
      <Gap size={16} />
      <TextLink onClick={onSignOut}>Sign out</TextLink>
    </>
  );
}
