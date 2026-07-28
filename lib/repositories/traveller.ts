import type { SupabaseClient } from '@supabase/supabase-js';

import type {
  BookingInsert,
  BookingStatus,
  MessageInsert,
  ProfileUpdate,
} from '@/types/database';

import type { Client } from './catalogue';

/**
 * Write boundary.
 *
 * The hand-written Database type resolves correctly for reads, but
 * @supabase/supabase-js 2.110 does not pick it up in its write-type helpers,
 * which leaves .insert() and .update() typed `never`. Payloads are checked
 * against the exported Insert/Update types *before* crossing this boundary,
 * so nothing is silently unchecked — only the client generic is dropped.
 */
function writable(client: Client): SupabaseClient {
  return client as unknown as SupabaseClient;
}

/**
 * Traveller repository — everything a signed-in traveller owns.
 *
 * Row level security scopes all of this to the caller, so no query here
 * filters by user id: the database does it. See 0002_domain.sql.
 */

export async function listBookings(client: Client) {
  const { data, error } = await client
    .from('bookings')
    .select(
      `
      id, date_label, detail_line, status_line, status, day,
      experiences!inner ( hosts!inner ( name ) )
    `
    )
    .order('day', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function findBooking(client: Client, id: string) {
  const { data, error } = await client
    .from('bookings')
    .select(
      `
      id, date_label, time_label, address, directions_note, host_phone,
      what_to_bring,
      experiences!inner ( hosts!inner ( name ) )
    `
    )
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export interface NewBooking {
  experienceSlug: string;
  day: string;
  dateLabel: string;
  timeLabel: string;
  partySize: number;
  total: number;
  hostShare: number;
  paymentMethod: string | null;
}

/** Create booking — the write behind Checkout's "Confirm and pay". */
export async function createBooking(client: Client, input: NewBooking) {
  const { data: experience, error: lookupError } = await client
    .from('experiences')
    .select('id, village, hosts!inner ( name, phone )')
    .eq('slug', input.experienceSlug)
    .maybeSingle();

  if (lookupError) throw new Error(lookupError.message);
  if (!experience) throw new Error('That experience no longer exists.');

  const { data: auth } = await client.auth.getUser();
  if (!auth.user) throw new Error('You need to be signed in to book.');

  const host = (
    experience as unknown as { hosts: { name: string; phone: string | null } }
  ).hosts;

  const payload: BookingInsert = {
    user_id: auth.user.id,
    experience_id: (experience as unknown as { id: string }).id,
    day: input.day,
    date_label: input.dateLabel,
    time_label: input.timeLabel,
    party_size: input.partySize,
    total: input.total,
    host_share: input.hostShare,
    status: 'upcoming',
    payment_method: input.paymentMethod,
    host_phone: host?.phone ?? null,
  };

  const { data, error } = await writable(client)
    .from('bookings')
    .insert(payload)
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Update booking status — used when a booking is cancelled or completed. */
export async function updateBookingStatus(
  client: Client,
  id: string,
  status: 'upcoming' | 'past' | 'cancelled'
) {
  const patch: { status: BookingStatus } = { status };
  const { error } = await writable(client)
    .from('bookings')
    .update(patch)
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function listConversations(client: Client) {
  const { data, error } = await client
    .from('conversations')
    .select(
      `
      id, unread,
      hosts!inner ( name ),
      messages ( body, sent_at )
    `
    )
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listMessages(client: Client, conversationId: string) {
  const { data, error } = await client
    .from('messages')
    .select(
      'id, author, body, sent_at, conversations!inner ( hosts!inner ( name ) )'
    )
    .eq('conversation_id', conversationId)
    .order('sent_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Send message. §07 — sending does not navigate. */
export async function sendMessage(
  client: Client,
  conversationId: string,
  body: string
) {
  const payload: MessageInsert = {
    conversation_id: conversationId,
    author: 'traveller',
    body,
  };
  const { data, error } = await writable(client)
    .from('messages')
    .insert(payload)
    .select('id, author, body, sent_at')
    .single();

  if (error) throw new Error(error.message);
  return data as { id: string; author: string; body: string; sent_at: string };
}

export async function findSettings(client: Client, userId: string) {
  const { data, error } = await client
    .from('user_settings')
    .select('booking_updates, host_messages, language, payment_summary')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

/** Update profile — Profile screen. */
export async function updateProfile(
  client: Client,
  userId: string,
  patch: ProfileUpdate
) {
  const { error } = await writable(client)
    .from('profiles')
    .update(patch)
    .eq('id', userId);
  if (error) throw new Error(error.message);
}
