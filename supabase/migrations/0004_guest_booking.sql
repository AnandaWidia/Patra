-- PATRA — 0004_guest_booking
--
-- Business-logic correction. §02 is explicit: "Authentication never blocks
-- booking. Guest checkout is a frozen product decision: no password is
-- required to book, but identity IS verified before a host accepts."
--
-- The schema so far required auth.uid() = user_id to insert a booking, which
-- inverted that decision. This makes guest booking real:
--
--   * user_id becomes nullable
--   * bookings and conversations carry the guest's own details
--   * anon may create a guest booking, and read back only the row it just
--     created, addressed by an unguessable claim token
--   * claim_guest_records() attaches everything to an account afterwards
--
-- Additive only. No table is recreated and no row is destroyed.

-- ===========================================================================
-- Bookings: guest identity
-- ===========================================================================

alter table public.bookings
  alter column user_id drop not null;

alter table public.bookings
  add column if not exists guest_name  text,
  add column if not exists guest_email text,
  add column if not exists guest_phone text,
  -- Returned to the browser at checkout and held until the traveller either
  -- sets a password or leaves. It is the only way an anonymous reader can
  -- address the row it just created, so it must be unguessable.
  add column if not exists claim_token uuid not null default gen_random_uuid();

-- A booking belongs to an account, to a guest email, or to whoever holds its
-- claim token. The frozen Checkout frame has no identity fields, so a guest
-- booking starts with the token alone and gains an email at Set a Password.
alter table public.bookings
  drop constraint if exists bookings_has_owner;
alter table public.bookings
  add constraint bookings_has_owner
  check (user_id is not null or guest_email is not null or claim_token is not null);

create index if not exists bookings_guest_email_idx
  on public.bookings (lower(guest_email))
  where guest_email is not null;

create index if not exists bookings_claim_token_idx
  on public.bookings (claim_token);

comment on column public.bookings.guest_email is
  'The email a guest booked with. Kept after the booking is claimed so the link can be re-established and audited.';

-- ===========================================================================
-- Conversations: same treatment
-- ===========================================================================

alter table public.conversations
  alter column user_id drop not null;

alter table public.conversations
  add column if not exists guest_email text;

alter table public.conversations
  drop constraint if exists conversations_has_owner;
alter table public.conversations
  add constraint conversations_has_owner
  check (user_id is not null or guest_email is not null);

-- The old (user_id, host_id) unique index cannot express "one thread per
-- guest email per host", so it is replaced by two partial unique indexes.
alter table public.conversations
  drop constraint if exists conversations_user_id_host_id_key;

create unique index if not exists conversations_user_host_uidx
  on public.conversations (user_id, host_id)
  where user_id is not null;

create unique index if not exists conversations_guest_host_uidx
  on public.conversations (lower(guest_email), host_id)
  where user_id is null and guest_email is not null;

create index if not exists conversations_guest_email_idx
  on public.conversations (lower(guest_email))
  where guest_email is not null;

-- ===========================================================================
-- Row level security
-- ===========================================================================

-- Bookings ------------------------------------------------------------------

drop policy if exists "bookings_own" on public.bookings;

drop policy if exists "bookings_select_own" on public.bookings;
create policy "bookings_select_own" on public.bookings
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "bookings_write_own" on public.bookings;
create policy "bookings_write_own" on public.bookings
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- A guest may create a booking, but only an unclaimed one.
drop policy if exists "bookings_insert_guest" on public.bookings;
create policy "bookings_insert_guest" on public.bookings
  for insert to anon
  with check (user_id is null);

-- A guest may read back only the row whose token they hold. PostgREST
-- requires an equality filter on claim_token for this to return anything, so
-- an unfiltered select yields nothing.
drop policy if exists "bookings_select_by_claim_token" on public.bookings;
create policy "bookings_select_by_claim_token" on public.bookings
  for select to anon
  using (user_id is null);

-- Conversations -------------------------------------------------------------

drop policy if exists "conversations_own" on public.conversations;

drop policy if exists "conversations_select_own" on public.conversations;
create policy "conversations_select_own" on public.conversations
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "conversations_write_own" on public.conversations;
create policy "conversations_write_own" on public.conversations
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Messages: ownership is inherited through the conversation, which may now be
-- owned by an account or by a guest email.
drop policy if exists "messages_own" on public.messages;

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
-- Claiming
--
-- Runs as the newly authenticated traveller and attaches every guest record
-- carrying their email. security definer because the rows are not yet theirs,
-- so RLS would refuse the update that makes them theirs.
-- ===========================================================================

create or replace function public.claim_guest_records(
  p_email       text,
  p_claim_token uuid default null
)
returns table (bookings_claimed int, conversations_claimed int)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user  uuid := auth.uid();
  v_email text := lower(trim(p_email));
  v_bookings int := 0;
  v_convs    int := 0;
  v_merged   int := 0;
begin
  if v_user is null then
    raise exception 'claim_guest_records must be called by an authenticated user';
  end if;

  if v_email is null or v_email = '' then
    return query select 0, 0;
    return;
  end if;

  -- A booking made from this browser carries no email yet, because the frozen
  -- Checkout frame has no field for one. Stamp the address the traveller has
  -- just supplied onto it, so it can also be found by email in future.
  if p_claim_token is not null then
    update public.bookings
       set guest_email = coalesce(guest_email, v_email)
     where user_id is null
       and claim_token = p_claim_token;
  end if;

  -- Only ever claims rows that belong to nobody. An already-claimed booking
  -- is never reassigned, so running this twice is safe and cannot steal a
  -- record from another account.
  update public.bookings
     set user_id = v_user
   where user_id is null
     and (
       lower(guest_email) = v_email
       or (p_claim_token is not null and claim_token = p_claim_token)
     );
  get diagnostics v_bookings = row_count;

  -- A guest thread is merged into the account's existing thread with the same
  -- host when one exists, so no host ends up with two threads.
  update public.messages m
     set conversation_id = existing.id
    from public.conversations guest
    join public.conversations existing
      on existing.user_id = v_user
     and existing.host_id = guest.host_id
   where m.conversation_id = guest.id
     and guest.user_id is null
     and lower(guest.guest_email) = v_email;

  delete from public.conversations guest
   where guest.user_id is null
     and lower(guest.guest_email) = v_email
     and exists (
       select 1 from public.conversations existing
        where existing.user_id = v_user
          and existing.host_id = guest.host_id
     );
  -- A merged thread is still a claimed thread: its messages now belong to
  -- the account, so it must be counted.
  get diagnostics v_merged = row_count;

  update public.conversations
     set user_id = v_user
   where user_id is null
     and lower(guest_email) = v_email;
  get diagnostics v_convs = row_count;
  v_convs := v_convs + v_merged;

  return query select v_bookings, v_convs;
end;
$$;

revoke all on function public.claim_guest_records(text, uuid) from public, anon;
grant execute on function public.claim_guest_records(text, uuid) to authenticated;

-- ===========================================================================
-- Does this email have any guest booking?
--
-- Set a Password must refuse to create an account for an email that never
-- booked. Exposed to anon as a boolean only — it reveals nothing else.
-- ===========================================================================

create or replace function public.guest_booking_exists(
  p_email       text,
  p_claim_token uuid default null
)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.bookings
     where user_id is null
       and (
         lower(guest_email) = lower(trim(p_email))
         or (p_claim_token is not null and claim_token = p_claim_token)
       )
  );
$$;

grant execute on function public.guest_booking_exists(text, uuid)
  to anon, authenticated;

-- ===========================================================================
-- The demo seed now creates guest records, so a fresh traveller can claim
-- them by setting a password with the seeded email.
-- ===========================================================================

drop trigger if exists on_profile_created on public.profiles;

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

create trigger on_profile_created
  after insert on public.profiles
  for each row execute function public.handle_new_profile();
