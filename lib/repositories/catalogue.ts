import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/database';

/**
 * Catalogue repository — public reference data.
 *
 * Repositories only talk to the database. Shaping rows for a screen is the
 * service layer's job, and nothing here imports React.
 */
export type Client = SupabaseClient<Database>;

const EXPERIENCE_CARD_SELECT = `
  slug,
  photo_key,
  host:hosts!inner ( name ),
  variants:experience_card_variants ( surface, label, detail, verification )
`;

export async function listExperiences(client: Client) {
  const { data, error } = await client
    .from('experiences')
    .select(EXPERIENCE_CARD_SELECT)
    .order('next_open_date', { ascending: true, nullsFirst: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function findExperienceBySlug(client: Client, slug: string) {
  const { data, error } = await client
    .from('experiences')
    .select(
      `
      slug, village_label, craft_line, photo_brief, fixed_details,
      long_story, verification_note,
      revenue_label, revenue_figures, revenue_justification, duration_line,
      availability_summary, availability_attributed_to, availability_explanation,
      reviews_intro,
      host:hosts!inner ( slug, name, story_line, verified_by )
    `
    )
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function findHostBySlug(client: Client, slug: string) {
  const { data, error } = await client
    .from('hosts')
    .select(
      `
      slug, name, village, regency, craft, long_story, quote_original,
      quote_translated, verified_by, verification_note
    `
    )
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function listReviewsForExperience(client: Client, slug: string) {
  const { data, error } = await client
    .from('reviews')
    .select(
      'id, author_name, author_city, body, attended_date, experiences!inner(slug)'
    )
    .eq('experiences.slug', slug)
    .order('attended_date', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listCalendarEvents(client: Client) {
  const { data, error } = await client
    .from('calendar_events')
    .select(
      'id, name, status, status_label, attributed_to, explanation, availability'
    )
    .order('start_date', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listAvailability(
  client: Client,
  slug: string,
  from: string,
  to: string
) {
  const { data, error } = await client
    .from('experience_availability')
    .select('day, is_open, closed_reason, experiences!inner(slug)')
    .eq('experiences.slug', slug)
    .gte('day', from)
    .lte('day', to)
    .order('day', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listPaymentRails(client: Client) {
  const { data, error } = await client
    .from('payment_rails')
    .select('id, label, detail')
    .order('sort_order', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}
