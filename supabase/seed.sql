-- PATRA — demonstration seed
--
-- Reproduces the frozen frames exactly: every string here is the copy the
-- Figma frames carry, so the application looks identical once it reads from
-- the database instead of the JSON.
--
-- Reference data (hosts, experiences, calendar, reviews, rails) is inserted
-- directly. Traveller-owned data (bookings, conversations, messages) cannot
-- be: it needs a real auth user. That is handled by
-- `seed_demo_data_for_user`, which runs automatically for every new profile,
-- so signing up produces a populated application immediately.
--
-- Safe to run more than once.

-- ===========================================================================
-- Hosts
-- ===========================================================================

insert into public.hosts (
  slug, name, village, regency, craft, phone, story_line, long_story,
  quote_original, quote_translated, verified_by, verified_date,
  verification_method, verified_in_person, verification_note
) values
(
  'host-01', 'I Made Suarta', 'Mas', 'Gianyar',
  'Wood carver · Mas, Gianyar', '+62 812 3456 7890',
  'He carves the same figure his grandfather carved.',
  array[
    'You will hold a chisel that is older than you are, and you will be bad at it. He will correct your grip once, quietly, and then let you keep going. By the afternoon you will have a piece of hibiscus wood with a shape in it that is recognisably yours and recognisably wrong.',
    'Rice, banana leaf and a knife are laid out before you arrive. Nothing is demonstrated. You are handed the tool.'
  ],
  'Tangan saya belajar dari tangan bapak saya. Bukan dari gambar, bukan dari buku.',
  'My hands learned from my father’s hands. Not from a drawing, not from a book.',
  'Banjar Mas, 12 June 2026', '2026-06-12', 'banjar-in-person', true,
  'Checked in person on 12 June 2026 by two members of the banjar. I Made has carved in this compound for thirty-one years and was nominated by the village, not by us. The banjar can withdraw this at any time, and we would not be told why.'
),
(
  'host-02', 'Ibu Wayan', 'Kemenuh', 'Gianyar',
  'Cooking and offerings · Kemenuh, Gianyar', '+62 813 5566 7788',
  'She cooks what the compound eats, not what a menu says.',
  array[
    'The kitchen is behind the family temple and the fire is already lit when you arrive. You will grind spice on stone until your arm complains, and she will tell you it is not fine enough yet.'
  ],
  null, null,
  'Banjar Kemenuh, 9 June 2026', '2026-06-09', 'banjar-in-person', true,
  'Checked in person by two members of Banjar Kemenuh. Ibu Wayan has cooked for compound ceremonies for over twenty years.'
),
(
  'host-03', 'Pak Nyoman', 'Singapadu', 'Gianyar',
  'Gamelan tuning · Singapadu, Gianyar', '+62 811 2233 4455',
  'He tunes bronze by ear, and the ear was his father’s.',
  array[
    'The forge is loud and hot and you will not be allowed near the fire. You will be handed a hammer and a key and asked to listen for the beat between two notes.'
  ],
  null, null,
  'Banjar Singapadu, 11 June 2026', '2026-06-11', 'banjar-in-person', true,
  'Checked in person by two members of Banjar Singapadu.'
)
on conflict (slug) do nothing;

-- ===========================================================================
-- Experiences
-- ===========================================================================

insert into public.experiences (
  slug, host_id, title, format, duration_hours, price_per_person, currency,
  group_cap, places_remaining, village, village_label, craft_line,
  next_open_date, photo_key, photo_brief, fixed_details,
  revenue_label, revenue_figures, revenue_justification, duration_line,
  availability_summary, availability_attributed_to, availability_explanation,
  reviews_intro
)
select
  v.slug, h.id, v.title, v.format, v.duration_hours, v.price, 'IDR',
  v.group_cap, v.places, v.village, v.village_label, v.craft_line,
  v.next_open, v.photo_key, v.photo_brief, v.fixed,
  v.rev_label, v.rev_figures, v.rev_just, v.duration_line,
  v.avail_summary, v.avail_attr, v.avail_expl, v.reviews_intro
from (values
  (
    'exp-01', 'host-01', 'Carving in hibiscus wood', 'A day at his workbench',
    4, 375000, 6, 3, 'Mas, Gianyar', 'MAS, GIANYAR', 'Wood carver · Mas, Gianyar',
    date '2026-06-18', 'card-carving',
    'EXP-004 · Hero · hands, chisel, unfinished wood',
    array[
      'Four hours, from nine in the morning.',
      'Six people or fewer. Never more.',
      'Tools are his. The wood is yours to keep.'
    ],
    'WHERE YOUR MONEY GOES',
    'Rp375.000 per person. Of that, Rp300.000 goes directly to his household.',
    'The remaining Rp75.000 covers payment processing, the verification visit, and the Heritage Preservation Fund. You will see the same figures again before you pay.',
    'Four hours · Thursday 18 June is the next open day',
    'Closed 14–16 June for Galungan.',
    'EXPLAINED BY BANJAR MAS, IN THEIR WORDS',
    'The family is preparing offerings, which take three days. This happens roughly every 210 days. The next open days are 17, 18 and 19 June.',
    'Thirty-one people have been. These are the three most recent, not the three best.'
  ),
  (
    'exp-02', 'host-02', 'Cooking and offerings', 'A morning in her kitchen',
    5, 300000, 4, 4, 'Kemenuh, Gianyar', 'KEMENUH, GIANYAR', 'Cook · Kemenuh, Gianyar',
    date '2026-06-20', 'card-cooking',
    'EXP-005 · Hero · spice, stone, smoke',
    array[
      'Five hours, from eight in the morning.',
      'Four people or fewer.',
      'You eat what you cook, with the family.'
    ],
    'WHERE YOUR MONEY GOES',
    'Rp300.000 per person. Of that, Rp240.000 goes directly to her household.',
    'The remaining Rp60.000 covers payment processing, the verification visit, and the Heritage Preservation Fund. You will see the same figures again before you pay.',
    'Five hours · Saturday 20 June is the next open day',
    'Open most mornings before noon.',
    'EXPLAINED BY BANJAR KEMENUH, IN THEIR WORDS',
    'We finish before noon. After that the kitchen is free and Ibu Wayan has said she is happy to cook with visitors.',
    'Nineteen people have been. These are the most recent, not the best.'
  ),
  (
    'exp-03', 'host-03', 'Gamelan tuning', 'An afternoon in the forge',
    3, 350000, 8, 2, 'Singapadu, Gianyar', 'SINGAPADU, GIANYAR', 'Smith · Singapadu, Gianyar',
    date '2026-06-23', 'card-gamelan',
    'EXP-006 · Hero · bronze, hammer, heat',
    array[
      'Three hours, from two in the afternoon.',
      'Eight people or fewer.',
      'You will not be allowed near the fire.'
    ],
    'WHERE YOUR MONEY GOES',
    'Rp350.000 per person. Of that, Rp280.000 goes directly to his household.',
    'The remaining Rp70.000 covers payment processing, the verification visit, and the Heritage Preservation Fund. You will see the same figures again before you pay.',
    'Three hours · Tuesday 23 June is the next open day',
    'Open on weekday afternoons.',
    'EXPLAINED BY BANJAR SINGAPADU, IN THEIR WORDS',
    'The forge runs in the afternoon once the morning work is done.',
    'Eight people have been.'
  )
) as v(slug, host_slug, title, format, duration_hours, price, group_cap, places,
       village, village_label, craft_line, next_open, photo_key, photo_brief, fixed,
       rev_label, rev_figures, rev_just, duration_line,
       avail_summary, avail_attr, avail_expl, reviews_intro)
join public.hosts h on h.slug = v.host_slug
on conflict (slug) do nothing;

-- ===========================================================================
-- Experience Card copy, per surface
-- ===========================================================================

insert into public.experience_card_variants (experience_id, surface, label, detail, verification)
select e.id, v.surface, v.label, v.detail, v.verification
from (values
  ('exp-01', 'home',    'Carving in hibiscus wood', 'Thursday 18 June · three places left', 'Verified by Banjar Mas'),
  ('exp-02', 'home',    'Cooking and offerings',    'Saturday 20 June · four places left',  'Verified by Banjar Mas'),
  ('exp-03', 'home',    'Gamelan tuning',           'Tuesday 23 June · two places left',    'Verified by Banjar Mas'),
  ('exp-01', 'explore', 'MAS, GIANYAR',             'Carving, four hours, six people or fewer',             'Verified by Banjar Mas'),
  ('exp-02', 'explore', 'KEMENUH, GIANYAR',         'Cooking and offerings, five hours, four people or fewer', 'Verified by Banjar Kemenuh'),
  ('exp-03', 'explore', 'SINGAPADU, GIANYAR',       'Gamelan, three hours, eight people or fewer',          'Verified by Banjar Singapadu'),
  ('exp-01', 'offline', 'Carving in hibiscus wood', 'Mas, Gianyar',     'Verified by Banjar Mas'),
  ('exp-02', 'offline', 'Cooking and offerings',    'Kemenuh, Gianyar', 'Verified by Banjar Mas')
) as v(exp_slug, surface, label, detail, verification)
join public.experiences e on e.slug = v.exp_slug
on conflict (experience_id, surface) do nothing;

-- ===========================================================================
-- Availability — June 2026, matching frame 2:2913 (14–16 closed for Galungan)
-- ===========================================================================

insert into public.experience_availability (experience_id, day, is_open, closed_reason)
select
  e.id,
  d::date,
  extract(day from d) not in (14, 15, 16),
  case when extract(day from d) in (14, 15, 16)
    then 'The compound is closed for Galungan. The family is preparing offerings, which take three days.'
  end
from public.experiences e
cross join generate_series(date '2026-06-01', date '2026-06-30', interval '1 day') d
where e.slug = 'exp-01'
on conflict (experience_id, day) do nothing;

insert into public.experience_availability (experience_id, day, is_open, closed_reason)
select e.id, d::date, true, null
from public.experiences e
cross join generate_series(date '2026-06-01', date '2026-06-30', interval '1 day') d
where e.slug in ('exp-02', 'exp-03')
on conflict (experience_id, day) do nothing;

-- ===========================================================================
-- Ceremonial calendar — frame 2:3343
-- ===========================================================================

insert into public.calendar_events (
  slug, name, village, start_date, end_date, status, status_label,
  attributed_to, explanation, availability, bookable_from
) values
(
  'cal-01', 'Galungan', 'Mas, Gianyar', '2026-06-14', '2026-06-16', 'closed',
  '14–16 JUNE · CLOSED', 'EXPLAINED BY BANJAR MAS, IN THEIR WORDS',
  'The ancestors return and we prepare for three days. Every compound in Mas is closed. This happens roughly every 210 days, and it has never moved for anyone.',
  'Nothing is bookable on these three days.', '2026-06-18'
),
(
  'cal-02', 'The day after', 'Mas, Gianyar', '2026-06-18', '2026-06-18', 'open',
  '18 JUNE · OPEN', null,
  'The offerings are still standing and the penjor are still up. Hosts who open on this day often say it is the best one to come.',
  'Three experiences open. I Made Suarta, Ibu Wayan, Pak Nyoman.', '2026-06-18'
),
(
  'cal-03', 'Kuningan', 'Kemenuh, Gianyar', '2026-07-04', '2026-07-04', 'partial',
  '4 JULY · PARTIAL', 'EXPLAINED BY BANJAR KEMENUH, IN THEIR WORDS',
  'We finish before noon. After that the kitchen is free and Ibu Wayan has said she is happy to cook with visitors.',
  'One experience open, from two in the afternoon.', '2026-07-04'
)
on conflict (slug) do nothing;

-- ===========================================================================
-- Payment rails — frame 2:2557
-- ===========================================================================

insert into public.payment_rails (id, label, detail, sort_order) values
  ('pm-qris',   'QRIS',                     'processed by Midtrans',                   1),
  ('pm-wallet', 'GoPay, OVO or DANA',       'Opens your wallet app to approve',        2),
  ('pm-card',   'Card · Visa or Mastercard','Charged in rupiah. Your bank sets the rate.', 3)
on conflict (id) do nothing;

-- ===========================================================================
-- Reviews — frame 2:1863. Booking-gated, most recent first, never the best.
-- ===========================================================================

insert into public.reviews (
  experience_id, author_name, author_city, body, attended_date, verified_attendance
)
select e.id, v.author, v.city, v.body, v.attended, true
from (values
  ('exp-01', 'Emma W.',  'Melbourne', 'I Made corrected my grip once and then let me ruin the wood for three hours. He laughed when I apologised. The thing I made is bad and it is on my shelf.', date '2026-05-14'),
  ('exp-01', 'Tomás R.', 'Lisbon',    'Four hours is a long time if you are not actually interested in carving. My partner was bored by the second hour. I was not. Know which one you are before you book.', date '2026-05-02'),
  ('exp-01', 'Sofia L.', 'Canggu',    'We ate with his family afterwards. Nobody performed anything. His grandson kept trying to sell us a carving and was told off, which was the most real part of the day.', date '2026-04-28')
) as v(exp_slug, author, city, body, attended)
join public.experiences e on e.slug = v.exp_slug
where not exists (
  select 1 from public.reviews r
  where r.experience_id = e.id and r.author_name = v.author
);

-- ===========================================================================
-- Traveller-owned demonstration data
--
-- Bookings, conversations and messages need a real auth user, so they are
-- created per traveller. Every row is internally consistent: the booking
-- references a real experience, the conversation references the host of that
-- experience, and every message belongs to that conversation.
-- ===========================================================================

create or replace function public.seed_demo_data_for_user(p_user uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_exp_01   uuid;
  v_exp_02   uuid;
  v_host_01  uuid;
  v_host_02  uuid;
  v_booking  uuid;
  v_conv_01  uuid;
  v_conv_02  uuid;
begin
  -- Only seed once per traveller.
  if exists (select 1 from public.bookings where user_id = p_user) then
    return;
  end if;

  select id into v_exp_01 from public.experiences where slug = 'exp-01';
  select id into v_exp_02 from public.experiences where slug = 'exp-02';
  select id into v_host_01 from public.hosts where slug = 'host-01';
  select id into v_host_02 from public.hosts where slug = 'host-02';

  if v_exp_01 is null then
    return; -- reference seed has not been run yet
  end if;

  update public.user_settings
     set payment_summary = 'QRIS · Card ending 6411'
   where user_id = p_user;

  -- Upcoming booking — frame 2:2949.
  insert into public.bookings (
    user_id, experience_id, day, date_label, time_label, party_size,
    total, host_share, host_share_percent, status, status_line, detail_line,
    payment_method, address, directions_note, host_phone, what_to_bring,
    payout_date
  ) values (
    p_user, v_exp_01, '2026-06-18', 'THURSDAY 18 JUNE', 'Nine in the morning', 2,
    750000, 600000, 80, 'upcoming',
    'Nine in the morning · two people · confirmed',
    'Carving in hibiscus wood · Mas, Gianyar',
    'pm-qris', 'Banjar Mas, Jalan Raya Mas',
    'The compound with the two carved doors, forty metres past the temple on the left. There is no sign.',
    '+62 812 3456 7890',
    array[
      'Something you do not mind getting dust on',
      'Clothing that covers your knees'
    ],
    '2026-06-19'
  ) returning id into v_booking;

  insert into public.bookings (
    user_id, experience_id, day, date_label, time_label, party_size,
    total, host_share, host_share_percent, status, status_line, detail_line,
    payment_method, address, host_phone, payout_date
  ) values (
    p_user, v_exp_01, '2026-05-14', 'THURSDAY 14 MAY', 'Nine in the morning', 2,
    750000, 600000, 80, 'past',
    'Completed. Rp600.000 reached his household on 15 May.',
    'Carving in hibiscus wood · Mas, Gianyar',
    'pm-qris', 'Banjar Mas, Jalan Raya Mas', '+62 812 3456 7890', '2026-05-15'
  );

  insert into public.bookings (
    user_id, experience_id, day, date_label, time_label, party_size,
    total, host_share, host_share_percent, status, status_line, detail_line,
    payment_method, address, host_phone, payout_date
  ) values (
    p_user, v_exp_02, '2026-04-26', 'SATURDAY 26 APRIL', 'Nine in the morning', 2,
    600000, 480000, 80, 'past',
    'Completed. Rp480.000 reached her household on 27 April.',
    'Cooking and offerings · Kemenuh, Gianyar',
    'pm-qris', 'Kemenuh, Sukawati, Gianyar', '+62 813 5566 7788', '2026-04-27'
  );

  -- Conversations — frame 2:3292. One per host the traveller has booked.
  insert into public.conversations (user_id, host_id, booking_id, unread)
  values (p_user, v_host_01, v_booking, true)
  on conflict (user_id, host_id) where user_id is not null do nothing
  returning id into v_conv_01;

  if v_conv_01 is null then
    select id into v_conv_01 from public.conversations
     where user_id = p_user and host_id = v_host_01;
  end if;

  insert into public.conversations (user_id, host_id, unread)
  values (p_user, v_host_02, false)
  on conflict (user_id, host_id) where user_id is not null do nothing
  returning id into v_conv_02;

  if v_conv_02 is null then
    select id into v_conv_02 from public.conversations
     where user_id = p_user and host_id = v_host_02;
  end if;

  -- Messages — frame 2:3304.
  insert into public.messages (conversation_id, author, body, sent_at, delivered_via) values
    (v_conv_01, 'host',
     'Wear something you do not mind getting dust on. Cover your knees — the shrine is in the same courtyard as the workshop. Come hungry, we eat after.',
     '2026-06-14T09:12:00+08:00', 'whatsapp'),
    (v_conv_01, 'traveller',
     'Thank you. Is it alright if we arrive fifteen minutes early?',
     '2026-06-14T09:40:00+08:00', 'app'),
    (v_conv_01, 'host',
     'Come whenever. I am there from seven. If the gate is shut, push it — it sticks.',
     '2026-06-14T11:30:00+08:00', 'whatsapp');

  insert into public.messages (conversation_id, author, body, sent_at, delivered_via) values
    (v_conv_02, 'host',
     'It was good to cook with you. The recipe you asked about — my daughter wrote it down.',
     '2026-04-28T18:04:00+08:00', 'whatsapp');
end;
$$;

-- Run for every traveller as they arrive, and for anyone already registered.
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

  -- Deliberately does NOT seed demo bookings. Since guest booking became the
  -- product flow (§02), a traveller's Bookings screen must show the bookings
  -- they actually made and claimed — nothing fabricated. Call
  -- seed_demo_data_for_user(uuid) by hand if you want a populated demo
  -- account for a walkthrough.
  return new;
end;
$$;

drop trigger if exists on_profile_created on public.profiles;
create trigger on_profile_created
  after insert on public.profiles
  for each row execute function public.handle_new_profile();

-- No automatic backfill: see handle_new_profile above.
