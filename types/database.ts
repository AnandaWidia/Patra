/**
 * Database types.
 *
 * Mirrors supabase/migrations. Hand-written rather than generated so the
 * project has no dependency on the Supabase CLI; regenerate with
 * `supabase gen types typescript` if you prefer.
 */

export type UserRole = 'traveller' | 'host' | 'admin';
export type BookingStatus = 'upcoming' | 'past' | 'cancelled';
export type CalendarStatus = 'closed' | 'open' | 'partial';
export type MessageAuthor = 'host' | 'traveller';
export type CardSurface = 'home' | 'explore' | 'offline';

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id: string;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  role?: UserRole;
}

export interface ProfileUpdate {
  email?: string;
  full_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  role?: UserRole;
}

export interface HostRow {
  id: string;
  slug: string;
  name: string;
  village: string;
  regency: string;
  craft: string;
  phone: string | null;
  story_line: string | null;
  long_story: string[];
  quote_original: string | null;
  quote_translated: string | null;
  photo_url: string | null;
  verified_by: string | null;
  verified_date: string | null;
  verification_method: string | null;
  verified_in_person: boolean;
  verification_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExperienceRow {
  id: string;
  slug: string;
  host_id: string;
  title: string;
  format: string | null;
  duration_hours: number | null;
  price_per_person: number;
  currency: string;
  group_cap: number;
  places_remaining: number;
  village: string;
  village_label: string | null;
  craft_line: string | null;
  next_open_date: string | null;
  photo_key: string | null;
  photo_brief: string | null;
  fixed_details: string[];
  revenue_label: string | null;
  revenue_figures: string | null;
  revenue_justification: string | null;
  duration_line: string | null;
  availability_summary: string | null;
  availability_attributed_to: string | null;
  availability_explanation: string | null;
  reviews_intro: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExperienceCardVariantRow {
  experience_id: string;
  surface: CardSurface;
  label: string;
  detail: string;
  verification: string;
}

export interface ExperienceAvailabilityRow {
  experience_id: string;
  day: string;
  is_open: boolean;
  closed_reason: string | null;
}

export interface CalendarEventRow {
  id: string;
  slug: string;
  name: string;
  village: string;
  start_date: string;
  end_date: string;
  status: CalendarStatus;
  status_label: string;
  attributed_to: string | null;
  explanation: string;
  availability: string;
  bookable_from: string | null;
  created_at: string;
}

export interface PaymentRailRow {
  id: string;
  label: string;
  detail: string;
  sort_order: number;
}

export interface UserSettingsRow {
  user_id: string;
  booking_updates: boolean;
  host_messages: boolean;
  language: string;
  payment_summary: string | null;
  updated_at: string;
}

export interface BookingRow {
  id: string;
  user_id: string;
  experience_id: string;
  day: string;
  date_label: string;
  time_label: string;
  party_size: number;
  total: number;
  host_share: number;
  host_share_percent: number;
  status: BookingStatus;
  status_line: string | null;
  detail_line: string | null;
  payment_method: string | null;
  address: string | null;
  directions_note: string | null;
  host_phone: string | null;
  what_to_bring: string[];
  payout_date: string | null;
  offline_cached: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookingInsert {
  id?: string;
  user_id: string;
  experience_id: string;
  day: string;
  date_label: string;
  time_label: string;
  party_size: number;
  total: number;
  host_share: number;
  host_share_percent?: number;
  status?: BookingStatus;
  status_line?: string | null;
  detail_line?: string | null;
  payment_method?: string | null;
  address?: string | null;
  directions_note?: string | null;
  host_phone?: string | null;
  what_to_bring?: string[];
  payout_date?: string | null;
  offline_cached?: boolean;
}

export interface ConversationRow {
  id: string;
  user_id: string;
  host_id: string;
  booking_id: string | null;
  unread: boolean;
  created_at: string;
  updated_at: string;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  author: MessageAuthor;
  body: string;
  sent_at: string;
  delivered_via: 'app' | 'whatsapp';
  created_at: string;
}

export interface MessageInsert {
  id?: string;
  conversation_id: string;
  author: MessageAuthor;
  body: string;
  sent_at?: string;
  delivered_via?: 'app' | 'whatsapp';
}

export interface ReviewRow {
  id: string;
  experience_id: string;
  booking_id: string | null;
  author_name: string;
  author_city: string;
  body: string;
  attended_date: string;
  verified_attendance: boolean;
  created_at: string;
}

export interface UserSettingsInsert {
  user_id?: string;
  booking_updates?: boolean;
  host_messages?: boolean;
  language?: string;
  payment_summary?: string | null;
}

export interface ConversationInsert {
  id?: string;
  user_id?: string;
  host_id?: string;
  booking_id?: string | null;
  unread?: boolean;
}

/** Read-only reference tables share this shape. */
interface ReadOnly<Row> {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
}

export interface Database {
  // Required by @supabase/supabase-js 2.10x for its write-type helpers to
  // resolve. Without it, .insert() and .update() degrade to never.
  __InternalSupabase: { PostgrestVersion: '13' };
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      hosts: ReadOnly<HostRow>;
      experiences: ReadOnly<ExperienceRow>;
      experience_card_variants: ReadOnly<ExperienceCardVariantRow>;
      experience_availability: ReadOnly<ExperienceAvailabilityRow>;
      calendar_events: ReadOnly<CalendarEventRow>;
      payment_rails: ReadOnly<PaymentRailRow>;
      user_settings: {
        Row: UserSettingsRow;
        Insert: UserSettingsInsert;
        Update: UserSettingsInsert;
        Relationships: [];
      };
      bookings: {
        Row: BookingRow;
        Insert: BookingInsert;
        Update: BookingInsert;
        Relationships: [];
      };
      conversations: {
        Row: ConversationRow;
        Insert: ConversationInsert;
        Update: ConversationInsert;
        Relationships: [];
      };
      messages: {
        Row: MessageRow;
        Insert: MessageInsert;
        Update: MessageInsert;
        Relationships: [];
      };
      reviews: ReadOnly<ReviewRow>;
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
