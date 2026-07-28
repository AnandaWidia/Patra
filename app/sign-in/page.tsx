import { Suspense } from 'react';

import { AppShell } from '@/components/shell/app-shell';
import { SignInScreen } from '@/features/account/sign-in-screen';

export default function SignInPage() {
  return (
    <AppShell variant="pushed" title="Sign In">
      {/* The screen reads ?redirectTo via useSearchParams, which needs a
          boundary during prerender. The fallback is null so nothing renders
          twice and no layout shifts. */}
      <Suspense fallback={null}>
        <SignInScreen />
      </Suspense>
    </AppShell>
  );
}
