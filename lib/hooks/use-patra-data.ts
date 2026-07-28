'use client';

import * as catalogue from '@/lib/services/catalogue';
import * as traveller from '@/lib/services/traveller';
import type {
  BookingSummaryView,
  CalendarEventView,
  ConversationView,
  ExperienceDetail,
  ExperienceSummary,
  HostProfileView,
  MessageView,
  PaymentRailView,
  ReviewView,
} from '@/types/view-models';

import { useRemoteData } from './use-remote-data';

/**
 * One hook per screen's data need.
 *
 * These exist so a screen can replace a JSON import with a call and change
 * nothing else — no prop, no layout, no JSX. Each returns the same shape the
 * JSON did, plus loading and error, which the screens are free to ignore
 * because a usable fallback is always present.
 */

export const EMPTY_EXPERIENCES: ExperienceSummary[] = [];

export function useExperiences() {
  return useRemoteData<ExperienceSummary[]>(
    catalogue.getExperiences,
    EMPTY_EXPERIENCES
  );
}

export function useExperienceDetail(slug: string) {
  return useRemoteData<ExperienceDetail>(
    () => catalogue.getExperienceDetail(slug),
    catalogue.CACHED_DETAIL,
    [slug]
  );
}

export function useHostProfile(slug: string) {
  return useRemoteData<HostProfileView>(
    () => catalogue.getHostProfile(slug),
    catalogue.CACHED_HOST,
    [slug]
  );
}

export function useReviews(slug: string) {
  return useRemoteData<ReviewView[]>(
    () => catalogue.getReviews(slug),
    [],
    [slug]
  );
}

export function useCalendarEvents() {
  return useRemoteData<CalendarEventView[]>(catalogue.getCalendarEvents, []);
}

export function usePaymentRails() {
  return useRemoteData<PaymentRailView[]>(catalogue.getPaymentRails, []);
}

export function useBookings() {
  return useRemoteData<BookingSummaryView[]>(traveller.getBookings, []);
}

export function useConversations() {
  return useRemoteData<ConversationView[]>(traveller.getConversations, []);
}

export function useMessages(conversationId: string) {
  return useRemoteData<MessageView[]>(
    () => traveller.getMessages(conversationId),
    [],
    [conversationId]
  );
}
