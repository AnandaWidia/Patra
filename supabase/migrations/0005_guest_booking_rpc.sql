-- PATRA — 0005_guest_booking_rpc
--
-- Fixes a security hole introduced by 0004.
--
-- 0004 gave anon a SELECT policy on bookings with `using (user_id is null)`,
-- on the reasoning that PostgREST would require a claim_token filter. That
-- reasoning was wrong: an unfiltered select returns EVERY unclaimed booking,
-- so any visitor could read every guest booking in the system. Live
-- verification caught it — a signed-out client read a booking back.
--
-- The policy existed only so that `insert(...).select('id, claim_token')`
-- could return the new row. Replacing that with a security definer function
-- removes the need for anon to hold any read access at all.

drop policy if exists "bookings_select_by_claim_token" on public.bookings;

-- Creating a booking is now a function call, not a table insert, so anon
-- needs neither INSERT nor SELECT on the table.
drop policy if exists "bookings_insert_guest" on public.bookings;

create or replace function public.create_guest_booking(
  p_experience_slug text,
  p_day             date,
  p_date_label      text,
  p_time_label      text,
  p_party_size      int,
  p_total           int,
  p_host_share      int,
  p_payment_method  text default null
)
returns table (id uuid, claim_token uuid)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_experience uuid;
  v_village    text;
  v_host_name  text;
  v_host_phone text;
begin
  -- §02 — booking never requires a session, so auth.uid() may be null here.

  select e.id, e.village, h.name, h.phone
    into v_experience, v_village, v_host_name, v_host_phone
    from public.experiences e
    join public.hosts h on h.id = e.host_id
   where e.slug = p_experience_slug;

  if v_experience is null then
    raise exception 'That experience no longer exists.';
  end if;

  if p_party_size < 1 or p_total < 0 or p_host_share < 0 then
    raise exception 'Those booking details are not valid.';
  end if;

  return query
  insert into public.bookings (
    user_id, experience_id, day, date_label, time_label, party_size,
    total, host_share, status, payment_method, host_phone,
    detail_line, status_line
  ) values (
    auth.uid(), v_experience, p_day, p_date_label, p_time_label, p_party_size,
    p_total, p_host_share, 'upcoming', p_payment_method, v_host_phone,
    trim(coalesce(v_host_name, '') || ' · ' || coalesce(v_village, '')),
    p_time_label || ' · confirmed'
  )
  returning public.bookings.id, public.bookings.claim_token;
end;
$$;

grant execute on function public.create_guest_booking(
  text, date, text, text, int, int, int, text
) to anon, authenticated;

comment on function public.create_guest_booking is
  'Guest checkout. Returns the new booking id and its claim token. Anon holds no direct read or write access to bookings.';
