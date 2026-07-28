'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

/**
 * Booking draft.
 *
 * §07 — the booking flow is six sequential pushes and "back is safe at every
 * step and must preserve entered data". That requirement is why the draft
 * lives here rather than in each screen's local state.
 */
export interface BookingDraft {
  experienceId: string | null;
  date: string | null;
  partySize: number | null;
  paymentMethodId: string | null;
  identityVerified: boolean;
}

const EMPTY: BookingDraft = {
  experienceId: null,
  date: null,
  partySize: null,
  paymentMethodId: null,
  identityVerified: false,
};

interface BookingContextValue {
  draft: BookingDraft;
  setDraft: (patch: Partial<BookingDraft>) => void;
  resetDraft: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraftState] = useState<BookingDraft>(EMPTY);

  const setDraft = useCallback((patch: Partial<BookingDraft>) => {
    setDraftState((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDraft = useCallback(() => setDraftState(EMPTY), []);

  const value = useMemo(
    () => ({ draft, setDraft, resetDraft }),
    [draft, setDraft, resetDraft]
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
