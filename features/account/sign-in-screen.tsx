'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

import { ActionControl, TextLink } from '@/components/ui/action-control';
import { Gap } from '@/components/ui/gap';
import { TextInput } from '@/components/ui/text-input';
import { HostBody, Label, Meta, Title } from '@/components/ui/typography';
import { ROUTES } from '@/constants/routes';
import { useSession } from '@/contexts/session-context';
import { signInWithPassword } from '@/lib/auth/actions';
import { claimGuestRecords, forgetGuest } from '@/lib/services/guest';

/**
 * Sign In — Figma 2:3190 "[COMPLETE] Sign In — 390 · Mobile".
 * §03 — email plus password. Never required to book.
 *
 * §08 specifies "Inline on submit" for loading and "Field-level, plain
 * language" for errors on this screen class. The error line is the only node
 * that was not already in the frame, and it renders nothing until a submit
 * actually fails, so the screen is pixel-identical in its resting state.
 */
export function SignInScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const { signIn, live } = useSession();

  // Without Supabase the frame's own placeholder values stand, exactly as
  // they were designed; with it, the traveller types their own.
  const [email, setEmail] = useState(live ? '' : 'emma.whitfield@gmail.com');
  const [password, setPassword] = useState(live ? '' : '••••••••••');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!live) {
      signIn();
      router.push(ROUTES.profile);
      return;
    }

    startTransition(async () => {
      const result = await signInWithPassword(email, password);
      if (!result.ok) {
        setError(result.message ?? 'That did not work. Try again.');
        return;
      }
      // "Find your bookings again" is literal. A traveller who set a password
      // while email confirmation was on had no session at the time, so Set a
      // Password could not claim for them — this is where it happens instead.
      // Idempotent by construction: claim_guest_records only ever takes rows
      // that belong to nobody.
      try {
        await claimGuestRecords(email.trim().toLowerCase());
        forgetGuest();
      } catch {
        // Never block a sign-in on this. The booking is still unclaimed and
        // the next sign-in will try again.
      }

      signIn();
      router.push(params.get('redirectTo') ?? ROUTES.profile);
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <Label>COMING BACK</Label>
      <Gap size={12} />
      <Title>Find your bookings again.</Title>
      <Gap size={16} />
      <HostBody>
        Use the email you booked with. Nothing else is needed.
      </HostBody>
      <Gap size={48} />

      <TextInput
        label="EMAIL"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <Gap size={16} />
      <TextInput
        label="PASSWORD"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      <Gap size={24} />

      <ActionControl type="submit" disabled={pending}>
        {pending ? 'Signing in' : 'Sign in'}
      </ActionControl>

      {error ? (
        <>
          <Gap size={12} />
          {/* §08 — never voice/refusal. A wrong password is not a village
              closing its compound. text/secondary, plain language. */}
          <Meta role="alert">{error}</Meta>
        </>
      ) : null}

      <Gap size={16} />
      <TextLink href={ROUTES.resetPassword}>Forgot your password</TextLink>
      <Gap size={48} />

      <Meta>
        No password yet? You do not need one to book. You can set one from your
        profile at any time.
      </Meta>
    </form>
  );
}
