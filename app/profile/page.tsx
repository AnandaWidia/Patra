'use client';

import { AppShell } from '@/components/shell/app-shell';
import { ProfileScreen } from '@/features/account/profile-screen';
import { ProfileSignedOutScreen } from '@/features/account/profile-signed-out-screen';
import { useSession } from '@/contexts/session-context';

/**
 * The Account tab. §02 — two mutually exclusive states, signed in and signed
 * out, both rendered here. Signed out is the only entry to authentication.
 */
export default function ProfilePage() {
  const { signedIn } = useSession();

  return (
    <AppShell variant="root" title="Account" back={false}>
      {signedIn ? <ProfileScreen /> : <ProfileSignedOutScreen />}
    </AppShell>
  );
}
