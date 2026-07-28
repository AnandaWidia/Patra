'use client';

import { BookingProvider } from './booking-context';
import { PresentationProvider } from './presentation-context';
import { SessionProvider } from './session-context';

/** Single composition point for application-wide context. */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PresentationProvider>
      <SessionProvider>
        <BookingProvider>{children}</BookingProvider>
      </SessionProvider>
    </PresentationProvider>
  );
}
