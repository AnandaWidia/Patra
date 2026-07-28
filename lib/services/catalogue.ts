import cachedCalendar from '@/data/offline/calendar.json';
import cachedExperiences from '@/data/offline/experiences.json';
import cachedHosts from '@/data/offline/hosts.json';
import cachedRails from '@/data/offline/payment-methods.json';
import cachedReviews from '@/data/offline/reviews.json';
import * as repo from '@/lib/repositories/catalogue';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type {
  CalendarEventView,
  ExperienceCardCopy,
  ExperienceDetail,
  ExperienceSummary,
  HostProfileView,
  PaymentRailView,
  ReviewView,
} from '@/types/view-models';

import { reviewAttendance, reviewAttribution } from './format';

/**
 * Catalogue service.
 *
 * Composes the view models the frozen screens consume out of normalized rows.
 *
 * Every reader falls back to `data/offline` when Supabase is unreachable or
 * not configured. That is not a leftover mock: §12 specifies a cache layer,
 * §08 rates Explore's offline state "Cached + unavailable list", and §15
 * requires the application to keep working with the network down. The cache
 * mirrors the seed, so the fallback is the same story, not a different one.
 */

function variant(
  variants: {
    surface: string;
    label: string;
    detail: string;
    verification: string;
  }[],
  surface: string
): ExperienceCardCopy {
  const found = variants.find((v) => v.surface === surface);
  return {
    label: found?.label ?? '',
    detail: found?.detail ?? '',
    verification: found?.verification ?? '',
  };
}

const CACHED_SUMMARIES: ExperienceSummary[] = cachedExperiences.map((e) => ({
  id: e.id,
  hostName: e.hostName,
  photoKey: e.photoKey,
  home: e.home,
  explore: e.explore,
}));

export async function getExperiences(): Promise<ExperienceSummary[]> {
  if (!isSupabaseConfigured()) return CACHED_SUMMARIES;

  const rows = await repo.listExperiences(createClient());
  if (rows.length === 0) return CACHED_SUMMARIES;

  return rows.map((row) => {
    const r = row as unknown as {
      slug: string;
      photo_key: string;
      host: { name: string };
      variants: {
        surface: string;
        label: string;
        detail: string;
        verification: string;
      }[];
    };
    return {
      id: r.slug,
      hostName: r.host.name,
      photoKey: r.photo_key,
      home: variant(r.variants, 'home'),
      explore: variant(r.variants, 'explore'),
    };
  });
}

export const CACHED_DETAIL: ExperienceDetail = {
  id: cachedHosts[0].id,
  name: cachedHosts[0].name,
  villageLabel: cachedHosts[0].villageLabel,
  craft: cachedHosts[0].craft,
  photoBrief: cachedHosts[0].photoBrief,
  storyLine: cachedHosts[0].storyLine,
  longStory: cachedHosts[0].longStory,
  verification: {
    label: cachedHosts[0].verification.label,
    verifiedBy: cachedHosts[0].verification.verifiedBy,
    note: cachedHosts[0].verification.note,
  },
  fixed: cachedHosts[0].fixed,
  revenueSplit: cachedHosts[0].revenueSplit,
  durationLine: cachedHosts[0].durationLine,
  availability: cachedHosts[0].availability,
  reviewsIntro: cachedHosts[0].reviewsIntro,
};

export async function getExperienceDetail(
  slug: string
): Promise<ExperienceDetail> {
  if (!isSupabaseConfigured()) return CACHED_DETAIL;

  const row = await repo.findExperienceBySlug(createClient(), slug);
  if (!row) return CACHED_DETAIL;

  const r = row as unknown as {
    slug: string;
    village_label: string;
    craft_line: string;
    photo_brief: string;
    fixed_details: string[];
    long_story: string[];
    verification_note: string;
    revenue_label: string;
    revenue_figures: string;
    revenue_justification: string;
    duration_line: string;
    availability_summary: string;
    availability_attributed_to: string;
    availability_explanation: string;
    reviews_intro: string;
    host: {
      slug: string;
      name: string;
      story_line: string;
      verified_by: string;
    };
  };

  return {
    id: r.host.slug,
    name: r.host.name,
    villageLabel: r.village_label,
    craft: r.craft_line,
    photoBrief: r.photo_brief,
    storyLine: r.host.story_line,
    longStory: r.long_story,
    verification: {
      label: 'VERIFIED BY THE VILLAGE',
      verifiedBy: r.host.verified_by,
      note: r.verification_note,
    },
    fixed: r.fixed_details,
    revenueSplit: {
      label: r.revenue_label,
      figures: r.revenue_figures,
      justification: r.revenue_justification,
    },
    durationLine: r.duration_line,
    availability: {
      summary: r.availability_summary,
      attributedTo: r.availability_attributed_to,
      explanation: r.availability_explanation,
    },
    reviewsIntro: r.reviews_intro,
  };
}

export const CACHED_HOST: HostProfileView = {
  id: cachedHosts[0].id,
  name: cachedHosts[0].name,
  villageLabel: cachedHosts[0].villageLabel,
  craft: 'Wood carver · third generation · thirty-one years',
  photoBrief: cachedHosts[0].photoBrief,
  quoteOriginal:
    'Tangan saya belajar dari tangan bapak saya. Bukan dari gambar, bukan dari buku.',
  quoteTranslated:
    'My hands learned from my father’s hands. Not from a drawing, not from a book.',
  longStory: [
    'He has carved the same figure for thirty-one years, and says he is still getting it wrong in different places. The wood is hibiscus, cut behind the compound. He will not use anything imported, and he will tell you why at some length if you ask.',
  ],
  verification: {
    label: 'VERIFIED BY THE VILLAGE',
    verifiedBy: cachedHosts[0].verification.verifiedBy,
    // Host Profile carries the full record (frame 2:2529); Experience Detail
    // carries the shorter pointer to it. They are different strings.
    note: 'Checked in person on 12 June 2026 by two members of the banjar. I Made has carved in this compound for thirty-one years and was nominated by the village, not by us. The banjar can withdraw this at any time, and we would not be told why.',
  },
};

export async function getHostProfile(slug: string): Promise<HostProfileView> {
  if (!isSupabaseConfigured()) return CACHED_HOST;

  const row = await repo.findHostBySlug(createClient(), slug);
  if (!row) return CACHED_HOST;

  const r = row as unknown as {
    slug: string;
    name: string;
    village: string;
    regency: string;
    craft: string;
    long_story: string[];
    quote_original: string | null;
    quote_translated: string | null;
    verified_by: string;
    verification_note: string;
  };

  return {
    id: r.slug,
    name: r.name,
    villageLabel: `${r.village}, ${r.regency}`.toUpperCase(),
    craft: CACHED_HOST.craft,
    photoBrief: CACHED_HOST.photoBrief,
    quoteOriginal: r.quote_original ?? '',
    quoteTranslated: r.quote_translated ?? '',
    longStory: r.long_story,
    verification: {
      label: 'VERIFIED BY THE VILLAGE',
      verifiedBy: r.verified_by,
      note: r.verification_note,
    },
  };
}

const CACHED_REVIEWS: ReviewView[] = cachedReviews.map((r) => ({
  id: r.id,
  attribution: r.attribution,
  body: r.body,
  attendance: r.attendance,
}));

export async function getReviews(slug: string): Promise<ReviewView[]> {
  if (!isSupabaseConfigured()) return CACHED_REVIEWS;

  const rows = await repo.listReviewsForExperience(createClient(), slug);
  if (rows.length === 0) return CACHED_REVIEWS;

  return rows.map((row) => {
    const r = row as unknown as {
      id: string;
      author_name: string;
      author_city: string;
      body: string;
      attended_date: string;
    };
    return {
      id: r.id,
      attribution: reviewAttribution(r.author_name, r.author_city),
      body: r.body,
      attendance: reviewAttendance(r.attended_date),
    };
  });
}

const CACHED_CALENDAR: CalendarEventView[] = cachedCalendar.map((c) => ({
  id: c.id,
  statusLabel: c.statusLabel,
  name: c.name,
  attributedTo: c.attributedTo,
  explanation: c.explanation,
  availability: c.availability,
  status: c.status as CalendarEventView['status'],
}));

export async function getCalendarEvents(): Promise<CalendarEventView[]> {
  if (!isSupabaseConfigured()) return CACHED_CALENDAR;

  const rows = await repo.listCalendarEvents(createClient());
  if (rows.length === 0) return CACHED_CALENDAR;

  return rows.map((row) => {
    const r = row as unknown as {
      id: string;
      name: string;
      status: CalendarEventView['status'];
      status_label: string;
      attributed_to: string | null;
      explanation: string;
      availability: string;
    };
    return {
      id: r.id,
      name: r.name,
      status: r.status,
      statusLabel: r.status_label,
      attributedTo: r.attributed_to ?? '',
      explanation: r.explanation,
      availability: r.availability,
    };
  });
}

const CACHED_RAILS: PaymentRailView[] = cachedRails.map((p) => ({
  id: p.id,
  label: p.label,
  detail: p.detail,
}));

export async function getPaymentRails(): Promise<PaymentRailView[]> {
  if (!isSupabaseConfigured()) return CACHED_RAILS;

  const rows = await repo.listPaymentRails(createClient());
  return rows.length === 0 ? CACHED_RAILS : (rows as PaymentRailView[]);
}
