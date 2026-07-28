'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { ActionControl, TextLink } from '@/components/ui/action-control';
import { Gap } from '@/components/ui/gap';
import { TextInput } from '@/components/ui/text-input';
import { HostBody, Label, Meta, Title } from '@/components/ui/typography';
import { ROUTES } from '@/constants/routes';
import { useSession } from '@/contexts/session-context';
import { requestPasswordReset } from '@/lib/auth/actions';

/**
 * Reset Password — Figma 2:3222 "[COMPLETE] Forgot Password — 390 · Mobile".
 * §03 — emailed link, one hour validity.
 */
export function ResetPasswordScreen() {
  const router = useRouter();
  const { user, live } = useSession();

  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!live) {
      router.push(ROUTES.signIn);
      return;
    }

    startTransition(async () => {
      const result = await requestPasswordReset(email);
      if (!result.ok) {
        setError(result.message ?? 'That did not work. Try again.');
        return;
      }
      // §08 — state what happened. Never confirm whether the address exists.
      setNotice(
        'If that email has an account, the link is on its way. It works for one hour.'
      );
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <Label>RESETTING</Label>
      <Gap size={12} />
      <Title>We will send you a link.</Title>
      <Gap size={16} />
      <HostBody>
        To the email you booked with. It works for one hour, and using it does
        not sign you out anywhere else.
      </HostBody>
      <Gap size={48} />

      <TextInput
        label="EMAIL"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <Gap size={24} />

      <ActionControl type="submit" disabled={pending}>
        {pending ? 'Sending the link' : 'Send the link'}
      </ActionControl>

      {error || notice ? (
        <>
          <Gap size={12} />
          <Meta role="alert">{error ?? notice}</Meta>
        </>
      ) : null}

      <Gap size={16} />
      <TextLink href={ROUTES.signIn}>Back to sign in</TextLink>
    </form>
  );
}
