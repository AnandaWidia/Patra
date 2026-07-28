import type { User as SupabaseUser } from '@supabase/supabase-js';

import mockProfile from '@/data/profile.json';
import type { ProfileRow } from '@/types/database';
import type { User } from '@/types/models';

/**
 * Maps a `profiles` row onto the §09 User shape the frozen UI already binds
 * to, so no screen has to change.
 *
 * Only the fields the profiles table actually stores are real. Verification,
 * payment methods and notification preferences remain mock: this milestone is
 * authentication only, and §09 lists them as separate concerns.
 */
export function toSessionUser(
  row: ProfileRow | null,
  authUser: SupabaseUser | null
): User {
  const fallback = mockProfile as User;

  if (!row && !authUser) return fallback;

  return {
    ...fallback,
    id: row?.id ?? authUser?.id ?? fallback.id,
    email: row?.email ?? authUser?.email ?? fallback.email,
    fullName: row?.full_name?.trim() || fallback.fullName,
    // A real account exists, so a password has been set.
    hasPassword: true,
  };
}

/** The mock traveller, used whenever Supabase is not configured. */
export const MOCK_USER = mockProfile as User;
