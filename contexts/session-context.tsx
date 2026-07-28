'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { MOCK_USER, toSessionUser } from '@/lib/auth/profile';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { ProfileRow } from '@/types/database';
import type { User } from '@/types/models';

/**
 * Session.
 *
 * §02 — authentication never blocks booking. Guest checkout is a frozen
 * product decision: no password is required to book, but identity IS verified
 * before a host accepts. Signed-in and signed-out are two mutually exclusive
 * states, both rendered on the Account tab.
 *
 * The public shape of this context is unchanged from the mock implementation
 * — `user`, `signedIn`, `signIn`, `signOut` — so every frozen screen that
 * consumes it keeps working untouched. When Supabase is not configured the
 * mock traveller is served exactly as before, which is what keeps the frozen
 * prototype demonstrable without credentials.
 */
interface SessionContextValue {
  user: User;
  signedIn: boolean;
  /** True until the first auth check resolves. */
  loading: boolean;
  /** Real authentication is wired up. */
  live: boolean;
  signIn: () => void;
  signOut: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const live = isSupabaseConfigured();

  // Without Supabase the frozen demo behaves exactly as it always has.
  const [signedIn, setSignedIn] = useState(!live);
  const [user, setUser] = useState<User>(MOCK_USER);
  const [loading, setLoading] = useState(live);

  useEffect(() => {
    if (!live) return;

    const supabase = createClient();
    let active = true;

    const load = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!authUser) {
        setSignedIn(false);
        setUser(MOCK_USER);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (!active) return;

      setUser(toSessionUser((profile as ProfileRow | null) ?? null, authUser));
      setSignedIn(true);
      setLoading(false);
    };

    void load();

    // Keeps the UI in step with token refreshes, sign-in and sign-out —
    // including those that happen in another tab.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void load();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [live]);

  // Retained for the mock path and for optimistic updates; the real state
  // always reconciles through onAuthStateChange.
  const signIn = useCallback(() => setSignedIn(true), []);
  const signOut = useCallback(() => {
    setSignedIn(false);
    setUser(MOCK_USER);
  }, []);

  const value = useMemo(
    () => ({ user, signedIn, loading, live, signIn, signOut }),
    [user, signedIn, loading, live, signIn, signOut]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
