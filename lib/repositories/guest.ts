import type { SupabaseClient } from '@supabase/supabase-js';

import type { Client } from './catalogue';

/**
 * Guest booking repository.
 *
 * §02 — "Authentication never blocks booking." Everything here runs for an
 * anonymous traveller. The frozen Checkout frame has no identity fields, so a
 * guest booking is addressed by an unguessable claim token until the
 * traveller supplies an email at Set a Password.
 */

function writable(client: Client): SupabaseClient {
  return client as unknown as SupabaseClient;
}

export interface GuestBookingInput {
  experienceSlug: string;
  day: string;
  dateLabel: string;
  timeLabel: string;
  partySize: number;
  total: number;
  hostShare: number;
  paymentMethod: string | null;
}

export interface GuestBookingResult {
  id: string;
  claimToken: string;
}

/**
 * Creates an unclaimed booking. No session and no identity required.
 *
 * Goes through create_guest_booking rather than a table insert: anon holds no
 * read or write grant on bookings at all, which is what closes the
 * enumeration hole 0005 fixes.
 */
export async function createGuestBooking(
  client: Client,
  input: GuestBookingInput
): Promise<GuestBookingResult> {
  const { data, error } = await writable(client).rpc('create_guest_booking', {
    p_experience_slug: input.experienceSlug,
    p_day: input.day,
    p_date_label: input.dateLabel,
    p_time_label: input.timeLabel,
    p_party_size: input.partySize,
    p_total: input.total,
    p_host_share: input.hostShare,
    p_payment_method: input.paymentMethod,
  });

  if (error) throw new Error(error.message);

  const created = (Array.isArray(data) ? data[0] : data) as {
    id: string;
    claim_token: string;
  } | null;

  if (!created) throw new Error('The booking could not be created.');
  return { id: created.id, claimToken: created.claim_token };
}

/**
 * Is there an unclaimed booking for this email, or for the token this browser
 * is holding? Gates account creation so no orphan accounts are created.
 */
export async function guestBookingExists(
  client: Client,
  email: string,
  claimToken: string | null
): Promise<boolean> {
  const { data, error } = await writable(client).rpc('guest_booking_exists', {
    p_email: email.trim().toLowerCase(),
    p_claim_token: claimToken,
  });

  if (error) throw new Error(error.message);
  return Boolean(data);
}

export interface ClaimResult {
  bookings: number;
  conversations: number;
}

/**
 * Attaches every guest record on this email — plus the booking this browser
 * holds the token for — to the caller's account. Idempotent.
 */
export async function claimGuestRecords(
  client: Client,
  email: string,
  claimToken: string | null
): Promise<ClaimResult> {
  const { data, error } = await writable(client).rpc('claim_guest_records', {
    p_email: email.trim().toLowerCase(),
    p_claim_token: claimToken,
  });

  if (error) throw new Error(error.message);

  const row = Array.isArray(data) ? data[0] : data;
  return {
    bookings: row?.bookings_claimed ?? 0,
    conversations: row?.conversations_claimed ?? 0,
  };
}
