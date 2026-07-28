import cachedBookings from '@/data/offline/bookings.json';
import cachedConversations from '@/data/offline/conversations.json';
import cachedMessages from '@/data/offline/messages.json';
import * as repo from '@/lib/repositories/traveller';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type {
  BookingSummaryView,
  ConversationView,
  MessageView,
} from '@/types/view-models';

import { dayAndTime, messageAttribution } from './format';

/**
 * Reads fall back to the cache on ANY failure, not just an empty result.
 *
 * §08 pairs every traveller surface with a cached offline state, and §15
 * requires Your Booking to render with the network down. A thrown query —
 * RLS refusing a signed-out reader, a dropped connection, or an id that is
 * not a uuid — must show the saved copy, never an empty screen.
 */
async function withCache<T>(
  load: () => Promise<T[]>,
  cache: T[]
): Promise<T[]> {
  try {
    const rows = await load();
    return rows.length === 0 ? cache : rows;
  } catch {
    return cache;
  }
}

/**
 * Traveller service.
 *
 * §08 rates Your Booking as the only surface with FULL offline priority, and
 * §15 requires it to render with the network disabled. The cache fallback is
 * therefore load-bearing here, not a convenience.
 */

const CACHED_BOOKINGS: BookingSummaryView[] = cachedBookings.map((b) => ({
  id: b.id,
  dateLabel: b.dateLabel,
  hostName: b.hostName,
  detail: b.detail,
  statusLine: b.statusLine,
  status: b.status as BookingSummaryView['status'],
}));

export async function getBookings(): Promise<BookingSummaryView[]> {
  if (!isSupabaseConfigured()) return CACHED_BOOKINGS;

  return withCache(async () => {
    const rows = await repo.listBookings(createClient());
    return rows.map((row) => {
      const r = row as unknown as {
        id: string;
        date_label: string;
        detail_line: string | null;
        status_line: string | null;
        status: BookingSummaryView['status'];
        experiences: { hosts: { name: string } };
      };
      return {
        id: r.id,
        dateLabel: r.date_label,
        hostName: r.experiences.hosts.name,
        detail: r.detail_line ?? '',
        statusLine: r.status_line ?? '',
        status: r.status,
      };
    });
  }, CACHED_BOOKINGS);
}

export const createBooking = repo.createBooking;
export const updateBookingStatus = repo.updateBookingStatus;

const CACHED_CONVERSATIONS: ConversationView[] = cachedConversations.map(
  (c) => ({
    id: c.id,
    hostName: c.hostName,
    lastMessagePreview: c.lastMessagePreview,
    lastMessageAt: c.lastMessageAt,
    unread: c.unread,
  })
);

export async function getConversations(): Promise<ConversationView[]> {
  if (!isSupabaseConfigured()) return CACHED_CONVERSATIONS;

  return withCache(async () => {
    const rows = await repo.listConversations(createClient());
    return rows.map((row) => {
      const r = row as unknown as {
        id: string;
        unread: boolean;
        hosts: { name: string };
        messages: { body: string; sent_at: string }[];
      };
      // The preview is the newest message; deriving it avoids storing a copy
      // that could drift from the thread.
      const latest = [...r.messages].sort((a, b) =>
        a.sent_at < b.sent_at ? 1 : -1
      )[0];
      return {
        id: r.id,
        hostName: r.hosts.name,
        lastMessagePreview: latest?.body ?? '',
        lastMessageAt: latest ? dayAndTime(latest.sent_at) : '',
        unread: r.unread,
      };
    });
  }, CACHED_CONVERSATIONS);
}

const CACHED_MESSAGES: MessageView[] = cachedMessages.map((m) => ({
  id: m.id,
  attribution: m.attribution,
  body: m.body,
  author: m.author as MessageView['author'],
}));

export async function getMessages(
  conversationId: string
): Promise<MessageView[]> {
  if (!isSupabaseConfigured()) return CACHED_MESSAGES;

  return withCache(async () => {
    const rows = await repo.listMessages(createClient(), conversationId);
    return rows.map((row) => {
      const r = row as unknown as {
        id: string;
        author: MessageView['author'];
        body: string;
        sent_at: string;
        conversations: { hosts: { name: string } };
      };
      return {
        id: r.id,
        author: r.author,
        body: r.body,
        attribution: messageAttribution(
          r.author,
          r.conversations.hosts.name,
          r.sent_at
        ),
      };
    });
  }, CACHED_MESSAGES);
}

/** Send message. §07 — sending does not navigate. */
export async function sendMessage(
  conversationId: string,
  body: string
): Promise<MessageView | null> {
  if (!isSupabaseConfigured()) return null;

  const row = await repo.sendMessage(createClient(), conversationId, body);
  if (!row) return null;

  return {
    id: row.id,
    author: 'traveller',
    body: row.body,
    attribution: messageAttribution('traveller', '', row.sent_at),
  };
}
