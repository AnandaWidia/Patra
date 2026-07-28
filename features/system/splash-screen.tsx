'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Display } from '@/components/ui/typography';
import { SPLASH_DWELL_MS } from '@/constants/design';
import { ROUTES } from '@/constants/routes';

/**
 * Splash — §03 "Launch identity".
 *
 * §07 — AFTER_TIMEOUT 800ms → push to Home. Automatic, no tap target and no
 * skip control. The 800ms is a dwell timer, not a transition (§05).
 * §02 — an entry surface: no chrome at all.
 * §10 — the wordmark is type, not artwork: PATRA in host/display.
 */
export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const id = window.setTimeout(
      () => router.push(ROUTES.home),
      SPLASH_DWELL_MS
    );
    return () => window.clearTimeout(id);
  }, [router]);

  return (
    <div className="bg-surface-page flex h-full flex-col items-center justify-center">
      <Display as="h1">PATRA</Display>
    </div>
  );
}
