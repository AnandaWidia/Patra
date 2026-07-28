-- PATRA — 0003_split_narratives
--
-- Bug found during live verification: Host Profile rendered Experience
-- Detail's narrative and verification note, making the screen 113px taller
-- than the frozen frame (1816 vs 1703). Experience Detail was 60px tall for
-- the same reason (2578 vs 2518).
--
-- Root cause: hosts.long_story and hosts.verification_note were each doing
-- two jobs. The frozen frames carry different copy in each place:
--
--   Experience Detail (2:1863) — the DAY. "You will hold a chisel that is
--   older than you are..." plus a short pointer: "The full verification
--   record, and his own account of the work, are on his profile."
--
--   Host Profile (2:2529) — the PERSON. "He has carved the same figure for
--   thirty-one years..." plus the full verification record.
--
-- The day belongs to the experience; the person belongs to the host. This
-- splits them, which is also the more normalized arrangement.

alter table public.experiences
  add column if not exists long_story text[] not null default '{}',
  add column if not exists verification_note text;

comment on column public.experiences.long_story is
  'The day, as told on Experience Detail. The host''s own story lives on hosts.long_story.';
comment on column public.experiences.verification_note is
  'Short pointer shown on Experience Detail. The full record lives on hosts.verification_note.';

-- Move the day narrative off the host and onto the experience.
update public.experiences e
   set long_story = h.long_story
  from public.hosts h
 where h.id = e.host_id
   and cardinality(e.long_story) = 0
   and cardinality(h.long_story) > 0;

update public.experiences
   set verification_note =
     'The full verification record, and his own account of the work, are on his profile.'
 where verification_note is null;

-- Give the host their own story back.
update public.hosts
   set long_story = array[
     'He has carved the same figure for thirty-one years, and says he is still getting it wrong in different places. The wood is hibiscus, cut behind the compound. He will not use anything imported, and he will tell you why at some length if you ask.'
   ]
 where slug = 'host-01';

update public.hosts
   set long_story = array[
     'She has cooked for compound ceremonies for over twenty years, and measures nothing. The spice is ground on stone because she says the machine makes it taste like metal.'
   ]
 where slug = 'host-02';

update public.hosts
   set long_story = array[
     'He tunes by ear, and the ear was his father''s. A gamelan set takes him a season, and he will not sell one until it has been played through a full ceremony.'
   ]
 where slug = 'host-03';
