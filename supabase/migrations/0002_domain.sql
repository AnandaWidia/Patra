-- PATRA — 0002_domain
--
-- Milestone 2. Every table the frozen frontend actually reads, and nothing
-- else. No table here exists without a screen that consumes it.
--
-- Reference public content (hosts, experiences, calendar, reviews) is
-- world-readable: §02 makes browsing and booking possible without an account,
-- so gating discovery behind auth would contradict a frozen product decision.
-- Everything owned by a traveller is private to that traveller.

-- ===========================================================================
-- Reference: hosts
-- ===========================================================================

create table if not exists public.hosts (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text not null unique,
  name                  text not null,
  village               text not null,
  regency               text not null,
  craft                 text not null,
  phone                 text,
  story_line            text,
  long_story            text[] not null default '{}',
  -- §14 — the Bahasa quotation on Host Profile, rendered host/lede italic.
  quote_original        text,
  quote_translated      text,
  photo_url             text,
  -- §04 Verification Block. Attribution is mandatory.
  verified_by           text,
  verified_date         date,
  verification_method   text check (verification_method in ('banjar-in-person', 'document-photo')),
  verified_in_person    boolean not null default true,
  verification_note     text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

comment on table public.hosts is 'A household that hosts. Verified in person by its own banjar.';

-- ===========================================================================
-- Reference: experiences
-- ===========================================================================

create table if not exists public.experiences (
  id                        uuid primary key default gen_random_uuid(),
  slug                      text not null unique,
  host_id                   uuid not null references public.hosts (id) on delete cascade,
  title                     text not null,
  format                    text,
  duration_hours            integer check (duration_hours > 0),
  price_per_person          integer not null check (price_per_person >= 0),
  currency                  text not null default 'IDR',
  group_cap                 integer not null check (group_cap > 0),
  places_remaining          integer not null default 0 check (places_remaining >= 0),
  village                   text not null,
  village_label             text,
  craft_line                text,
  next_open_date            date,
  -- Presentation asset key. See constants/assets.ts.
  photo_key                 text,
  photo_brief               text,
  -- Experience Detail copy. Per experience, never duplicated across rows.
  fixed_details             text[] not null default '{}',
  revenue_label             text,
  revenue_figures           text,
  revenue_justification     text,
  duration_line             text,
  availability_summary      text,
  availability_attributed_to text,
  availability_explanation  text,
  reviews_intro             text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  constraint experiences_places_within_cap check (places_remaining <= group_cap)
);

create index if not exists experiences_host_id_idx on public.experiences (host_id);
create index if not exists experiences_next_open_date_idx on public.experiences (next_open_date);

comment on table public.experiences is 'A day offered by a host. Carries no rating: §26 ranks price seventh and DD-03 rejected both on the card.';

-- ---------------------------------------------------------------------------
-- Card copy per surface.
--
-- Home and Explore show the same experience with different lines (Home leads
-- with the craft and the next open day; Explore leads with the village and
-- the format). Kept as rows rather than six columns on `experiences`.
-- ---------------------------------------------------------------------------

create table if not exists public.experience_card_variants (
  experience_id uuid not null references public.experiences (id) on delete cascade,
  surface       text not null check (surface in ('home', 'explore', 'offline')),
  label         text not null,
  detail        text not null,
  verification  text not null,
  primary key (experience_id, surface)
);

comment on table public.experience_card_variants is 'Experience Card lines, which differ per surface in the frozen frames.';

-- ---------------------------------------------------------------------------
-- Per-experience day availability — drives Choose a Day (frame 2:2913).
-- ---------------------------------------------------------------------------

create table if not exists public.experience_availability (
  experience_id uuid not null references public.experiences (id) on delete cascade,
  day           date not null,
  is_open       boolean not null default true,
  -- §04 — a closed day must carry a written reason, attributed.
  closed_reason text,
  primary key (experience_id, day),
  constraint availability_closed_has_reason
    check (is_open or closed_reason is not null)
);

create index if not exists experience_availability_day_idx
  on public.experience_availability (day);

-- ===========================================================================
-- Reference: ceremonial calendar
--
-- §03 — "These days belong to the villages, not to PATRA." Village-level by
-- design, so this deliberately does NOT reference an experience. Per-
-- experience closures live in experience_availability above.
-- ===========================================================================

create table if not exists public.calendar_events (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  village        text not null,
  start_date     date not null,
  end_date       date not null,
  status         text not null check (status in ('closed', 'open', 'partial')),
  status_label   text not null,
  attributed_to  text,
  explanation    text not null,
  availability   text not null,
  bookable_from  date,
  created_at     timestamptz not null default now(),
  constraint calendar_events_range check (end_date >= start_date)
);

create index if not exists calendar_events_start_date_idx
  on public.calendar_events (start_date);

-- ===========================================================================
-- Reference: payment rails (Checkout catalogue, frame 2:2557)
-- ===========================================================================

create table if not exists public.payment_rails (
  id         text primary key,
  label      text not null,
  detail     text not null,
  sort_order integer not null default 0
);

-- ===========================================================================
-- Traveller-owned: settings
-- ===========================================================================

create table if not exists public.user_settings (
  user_id         uuid primary key references public.profiles (id) on delete cascade,
  booking_updates boolean not null default true,
  host_messages   boolean not null default true,
  language        text not null default 'English · Bahasa Indonesia available',
  payment_summary text,
  updated_at      timestamptz not null default now()
);

-- ===========================================================================
-- Traveller-owned: bookings
-- ===========================================================================

create table if not exists public.bookings (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.profiles (id) on delete cascade,
  experience_id      uuid not null references public.experiences (id) on delete restrict,
  day                date not null,
  date_label         text not null,
  time_label         text not null,
  party_size         integer not null check (party_size > 0),
  total              integer not null check (total >= 0),
  -- §09 modelling note, binding: hostShare "is a stored figure shown to the
  -- traveller at checkout, not a computed display value — it must survive a
  -- price change". The same reasoning applies to the address and phone
  -- below: they are snapshots of what was true when the booking was made,
  -- not a denormalised copy of the host record.
  host_share         integer not null check (host_share >= 0),
  host_share_percent integer not null default 80,
  status             text not null default 'upcoming'
                     check (status in ('upcoming', 'past', 'cancelled')),
  status_line        text,
  detail_line        text,
  payment_method     text references public.payment_rails (id),
  address            text,
  directions_note    text,
  host_phone         text,
  what_to_bring      text[] not null default '{}',
  payout_date        date,
  -- §08 — Your Booking is the only surface rated FULL for offline.
  offline_cached     boolean not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint bookings_share_within_total check (host_share <= total)
);

create index if not exists bookings_user_id_idx on public.bookings (user_id);
create index if not exists bookings_experience_id_idx on public.bookings (experience_id);
create index if not exists bookings_user_status_day_idx
  on public.bookings (user_id, status, day desc);

-- ===========================================================================
-- Traveller-owned: conversations and messages
-- ===========================================================================

create table if not exists public.conversations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  host_id    uuid not null references public.hosts (id) on delete cascade,
  booking_id uuid references public.bookings (id) on delete set null,
  unread     boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, host_id)
);

create index if not exists conversations_user_id_idx on public.conversations (user_id);

comment on table public.conversations is 'One thread per traveller-host pair. §03 — the host replies via WhatsApp.';

create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  author          text not null check (author in ('host', 'traveller')),
  body            text not null,
  sent_at         timestamptz not null default now(),
  delivered_via   text not null default 'app' check (delivered_via in ('app', 'whatsapp')),
  created_at      timestamptz not null default now()
);

create index if not exists messages_conversation_sent_idx
  on public.messages (conversation_id, sent_at);

-- ===========================================================================
-- Reviews
--
-- §04 — "booking-gated... No rating and no score." A review therefore
-- references the booking that earned it. The booking may later be deleted
-- with the traveller's account, so the link is nullable and the author's
-- display name is stored on the review itself.
-- ===========================================================================

create table if not exists public.reviews (
  id                  uuid primary key default gen_random_uuid(),
  experience_id       uuid not null references public.experiences (id) on delete cascade,
  booking_id          uuid references public.bookings (id) on delete set null,
  author_name         text not null,
  author_city         text not null,
  body                text not null,
  attended_date       date not null,
  verified_attendance boolean not null default true,
  created_at          timestamptz not null default now()
);

create index if not exists reviews_experience_attended_idx
  on public.reviews (experience_id, attended_date desc);

-- ===========================================================================
-- updated_at triggers (function defined in 0001)
-- ===========================================================================

do $$
declare t text;
begin
  foreach t in array array['hosts', 'experiences', 'bookings', 'conversations', 'user_settings']
  loop
    execute format(
      'drop trigger if exists %I_set_updated_at on public.%I;
       create trigger %I_set_updated_at before update on public.%I
       for each row execute function public.set_updated_at();',
      t, t, t, t
    );
  end loop;
end $$;

-- ===========================================================================
-- Row level security
-- ===========================================================================

alter table public.hosts                     enable row level security;
alter table public.experiences               enable row level security;
alter table public.experience_card_variants  enable row level security;
alter table public.experience_availability   enable row level security;
alter table public.calendar_events           enable row level security;
alter table public.payment_rails             enable row level security;
alter table public.reviews                   enable row level security;
alter table public.user_settings             enable row level security;
alter table public.bookings                  enable row level security;
alter table public.conversations             enable row level security;
alter table public.messages                  enable row level security;

-- --- Public reference data: readable by anyone, including guests (§02). ---

do $$
declare t text;
begin
  foreach t in array array[
    'hosts', 'experiences', 'experience_card_variants',
    'experience_availability', 'calendar_events', 'payment_rails', 'reviews'
  ]
  loop
    execute format('drop policy if exists "%s_read_all" on public.%I;', t, t);
    execute format(
      'create policy "%s_read_all" on public.%I for select to anon, authenticated using (true);',
      t, t
    );
  end loop;
end $$;

-- --- Traveller-owned data: own rows only. ---

drop policy if exists "user_settings_own" on public.user_settings;
create policy "user_settings_own" on public.user_settings
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "bookings_own" on public.bookings;
create policy "bookings_own" on public.bookings
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "conversations_own" on public.conversations;
create policy "conversations_own" on public.conversations
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Messages are reached through their conversation, so ownership is inherited.
drop policy if exists "messages_own" on public.messages;
create policy "messages_own" on public.messages
  for all to authenticated
  using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and c.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and c.user_id = (select auth.uid())
    )
  );

-- ===========================================================================
-- Seed user_settings alongside each new profile
-- ===========================================================================

create or replace function public.handle_new_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_profile_created on public.profiles;
create trigger on_profile_created
  after insert on public.profiles
  for each row execute function public.handle_new_profile();

insert into public.user_settings (user_id)
select id from public.profiles
on conflict (user_id) do nothing;
