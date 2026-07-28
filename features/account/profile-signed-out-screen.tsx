'use client';

import { ActionControl, TextLink } from '@/components/ui/action-control';
import { Gap } from '@/components/ui/gap';
import { HostBody, Label, Title } from '@/components/ui/typography';
import { ROUTES } from '@/constants/routes';

/**
 * Profile (Signed Out) — Figma 2:3281.
 * §03 — the only entry point to authentication.
 */
export function ProfileSignedOutScreen() {
  return (
    <>
      <Label>NOT SIGNED IN</Label>
      <Gap size={12} />
      <Title>You do not need an account to book.</Title>
      <Gap size={16} />
      <HostBody>
        PATRA verifies who you are at the time of booking, and the host sees
        that before he accepts. An account changes none of that. It only lets
        you find your bookings again afterwards.
      </HostBody>
      <Gap size={48} />

      <ActionControl href={ROUTES.signIn}>Sign in</ActionControl>
      <Gap size={16} />
      <TextLink href={ROUTES.setPassword}>
        Set a password for a booking you already made
      </TextLink>
    </>
  );
}
