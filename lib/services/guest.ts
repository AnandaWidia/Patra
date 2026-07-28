'use client';

import * as repo from '@/lib/repositories/guest';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

/**
 * Guest booking service.
 *
 * The traveller books first and decides about an account afterwards, which is
 * the frozen product decision in §02. Until they set a password the booking
 * belongs to nobody, and this browser holds the only handle to it.
 */

const STORAGE_KEY = 'patra.guest';

export interface GuestRecord {
  bookingId: string;
  claimToken: string;
}

export function rememberGuest(record: GuestRecord): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Private browsing with storage disabled. The booking still exists and
    // can be claimed later by the email it ends up carrying.
  }
}

export function recallGuest(): GuestRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GuestRecord) : null;
  } catch {
    return null;
  }
}

export function forgetGuest(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clean up.
  }
}

export type { GuestBookingInput } from '@/lib/repositories/guest';

/**
 * Creates the booking. §07 — "Nothing is charged yet. I Made accepts before
 * you pay", so this is the only write Checkout performs.
 */
export async function createGuestBooking(
  input: repo.GuestBookingInput
): Promise<repo.GuestBookingResult | null> {
  if (!isSupabaseConfigured()) return null;

  const result = await repo.createGuestBooking(createClient(), input);
  rememberGuest({ bookingId: result.id, claimToken: result.claimToken });
  return result;
}

export async function guestBookingExists(email: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;
  return repo.guestBookingExists(
    createClient(),
    email,
    recallGuest()?.claimToken ?? null
  );
}

export async function claimGuestRecords(
  email: string
): Promise<repo.ClaimResult> {
  if (!isSupabaseConfigured()) return { bookings: 0, conversations: 0 };
  return repo.claimGuestRecords(
    createClient(),
    email,
    recallGuest()?.claimToken ?? null
  );
}
