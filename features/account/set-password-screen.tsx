'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { ActionControl } from '@/components/ui/action-control';
import { Gap } from '@/components/ui/gap';
import { TextInput } from '@/components/ui/text-input';
import { HostBody, Label, Meta, Title } from '@/components/ui/typography';
import { ROUTES } from '@/constants/routes';
import { useSession } from '@/contexts/session-context';
import { signUpWithPassword, updatePassword } from '@/lib/auth/actions';
import {
  claimGuestRecords,
  forgetGuest,
  guestBookingExists,
} from '@/lib/services/guest';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

/**
 * Set a Password — Figma 2:3207 "[COMPLETE] Sign Up — 390 · Mobile".
 *
 * §03 — "Post-booking only. Identity already verified."
 *
 * This is the product's only account-creation surface. There is no register
 * page, by design: a traveller books as a guest first and decides about an
 * account afterwards. Submitting here:
 *
 *   1. refuses if the email never booked — no orphan accounts
 *   2. creates the Supabase Auth user (profile and settings follow by trigger)
 *   3. signs in
 *   4. claims every guest booking, conversation and message on that email
 *
 * It also completes a password reset, because a session already exists when
 * the traveller arrives from the emailed link.
 */
export function SetPasswordScreen() {
  const router = useRouter();
  const { user, signIn, signedIn, live } = useSession();

  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(live ? '' : '••••••••••');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!live) {
      signIn();
      router.push(ROUTES.profile);
      return;
    }

    startTransition(async () => {
      const address = email.trim().toLowerCase();

      // Completing a reset: a session already exists, so only the password
      // changes. Nothing to claim.
      if (signedIn) {
        const updated = await updatePassword(password);
        if (!updated.ok) {
          setError(updated.message ?? 'That did not work. Try again.');
          return;
        }
        router.push(ROUTES.profile);
        router.refresh();
        return;
      }

      // §03 — post-booking only. An email that never booked gets no account.
      try {
        const hasBooking = await guestBookingExists(address);
        if (!hasBooking) {
          setError(
            'We cannot find a booking made with that email. Use the address you booked with.'
          );
          return;
        }
      } catch {
        setError('We could not check that email just now. Try again.');
        return;
      }

      const created = await signUpWithPassword(address, password);
      if (!created.ok) {
        setError(created.message ?? 'That did not work. Try again.');
        return;
      }

      // Email confirmation is on: no session yet, so claiming waits until
      // they confirm and sign in.
      if (created.message) {
        setNotice(created.message);
        return;
      }

      // Signing in explicitly on the client gives this tab the session the
      // claim runs under.
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        await supabase.auth.signInWithPassword({ email: address, password });
      }

      try {
        await claimGuestRecords(address);
        forgetGuest();
      } catch {
        // The account exists and the booking is safe; it simply is not linked
        // yet. Signing in again re-runs the claim.
      }

      signIn();
      router.push(ROUTES.profile);
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <Label>SETTING A PASSWORD</Label>
      <Gap size={12} />
      <Title>You are already verified.</Title>
      <Gap size={16} />
      <HostBody>
        We checked who you are when you booked with I Made, and he saw that
        before he accepted. A password does not change any of that. It only lets
        you come back to it.
      </HostBody>
      <Gap size={48} />

      <TextInput
        label="EMAIL · THE ONE YOU BOOKED WITH"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <Gap size={16} />
      <TextInput
        label="CHOOSE A PASSWORD"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
      />
      <Gap size={24} />

      <ActionControl type="submit" disabled={pending}>
        {pending ? 'Setting your password' : 'Set my password'}
      </ActionControl>

      {error || notice ? (
        <>
          <Gap size={12} />
          <Meta role="alert">{error ?? notice}</Meta>
        </>
      ) : null}

      <Gap size={16} />
      <Meta className="text-center">
        We will not send you anything you did not ask for.
      </Meta>
    </form>
  );
}
