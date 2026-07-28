/**
 * PATRA — live Supabase verification.
 *
 * Executes the integration audit against a real project and reports what
 * actually happened. It asserts; it does not assume.
 *
 *   node scripts/verify-supabase.mjs
 *
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL,
 * NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY.
 *
 * Run the migrations and seed first — DDL cannot be executed through the
 * JS client. See SUPABASE.md.
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

// --- env ---------------------------------------------------------------

function loadEnv(path) {
  let raw;
  try {
    raw = readFileSync(path, 'utf8');
  } catch {
    console.error(
      `\n  ${path} not found.\n  Copy .env.example to .env.local and fill in your keys.\n`
    );
    process.exit(1);
  }
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    const v = t
      .slice(i + 1)
      .trim()
      .replace(/^["']|["']$/g, '');
    if (v && !process.env[k]) process.env[k] = v;
  }
}

loadEnv('.env.local');

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

for (const [name, value] of [
  ['NEXT_PUBLIC_SUPABASE_URL', URL],
  ['NEXT_PUBLIC_SUPABASE_ANON_KEY', ANON],
  ['SUPABASE_SERVICE_ROLE_KEY', SERVICE],
]) {
  if (!value) {
    console.error(`\n  ${name} is missing from .env.local\n`);
    process.exit(1);
  }
}

const admin = createClient(URL, SERVICE, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const anon = createClient(URL, ANON, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// --- harness -----------------------------------------------------------

let pass = 0;
const failures = [];

async function check(name, fn) {
  try {
    const detail = await fn();
    pass += 1;
    console.log(`  PASS  ${name}${detail ? ` — ${detail}` : ''}`);
  } catch (error) {
    failures.push({ name, message: error.message });
    console.log(`  FAIL  ${name}\n          ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function section(title) {
  console.log(`\n${title}\n${'-'.repeat(title.length)}`);
}

// --- 1. reference data -------------------------------------------------

section('1. Reference data (seed)');

const EXPECTED = {
  hosts: 3,
  experiences: 3,
  experience_card_variants: 8,
  calendar_events: 3,
  payment_rails: 3,
  reviews: 3,
};

for (const [table, expected] of Object.entries(EXPECTED)) {
  await check(`${table} has ${expected} rows`, async () => {
    const { count, error } = await admin
      .from(table)
      .select('*', { count: 'exact', head: true });
    assert(!error, error?.message ?? 'query failed');
    assert(count === expected, `expected ${expected}, found ${count}`);
    return `${count} rows`;
  });
}

await check('experience_availability covers June 2026', async () => {
  const { count, error } = await admin
    .from('experience_availability')
    .select('*', { count: 'exact', head: true });
  assert(!error, error?.message ?? 'query failed');
  assert(count >= 90, `expected >= 90 day rows, found ${count}`);
  return `${count} day rows`;
});

await check('exp-01 closed 14-16 June with a written reason', async () => {
  const { data, error } = await admin
    .from('experience_availability')
    .select('day, is_open, closed_reason, experiences!inner(slug)')
    .eq('experiences.slug', 'exp-01')
    .eq('is_open', false);
  assert(!error, error?.message ?? 'query failed');
  assert(data.length === 3, `expected 3 closed days, found ${data.length}`);
  assert(
    data.every((d) => d.closed_reason),
    'a closed day is missing its reason (§04 requires one)'
  );
  return data.map((d) => d.day).join(', ');
});

// --- 2. relational integrity ------------------------------------------

section('2. Relational integrity');

await check('every experience references a real host', async () => {
  const { data, error } = await admin
    .from('experiences')
    .select('slug, hosts!inner(slug)');
  assert(!error, error?.message ?? 'query failed');
  assert(
    data.length === 3,
    `only ${data.length} of 3 experiences resolved a host`
  );
  return data.map((e) => `${e.slug}→${e.hosts.slug}`).join(', ');
});

await check('every card variant references a real experience', async () => {
  const { data, error } = await admin
    .from('experience_card_variants')
    .select('surface, experiences!inner(slug)');
  assert(!error, error?.message ?? 'query failed');
  assert(data.length === 8, `only ${data.length} of 8 variants resolved`);
  return 'all resolved';
});

await check('every review references a real experience', async () => {
  const { data, error } = await admin
    .from('reviews')
    .select('author_name, experiences!inner(slug)');
  assert(!error, error?.message ?? 'query failed');
  assert(data.length === 3, `only ${data.length} of 3 reviews resolved`);
  return 'all resolved';
});

// --- 3. row level security --------------------------------------------

section('3. Row level security');

await check(
  'anon CAN read public reference data (§02 guest browsing)',
  async () => {
    const { data, error } = await anon.from('experiences').select('slug');
    assert(!error, error?.message ?? 'query failed');
    assert(data.length > 0, 'anon read returned nothing');
    return `${data.length} experiences visible`;
  }
);

await check('anon CANNOT read bookings', async () => {
  const { data, error } = await anon.from('bookings').select('id');
  const blocked = Boolean(error) || (data?.length ?? 0) === 0;
  assert(
    blocked,
    'anon was able to read bookings — RLS is not protecting them'
  );
  return error ? 'rejected' : 'empty (no rows leaked)';
});

await check('anon CANNOT insert a booking', async () => {
  const { error } = await anon.from('bookings').insert({
    user_id: '00000000-0000-0000-0000-000000000000',
    experience_id: '00000000-0000-0000-0000-000000000000',
    day: '2026-06-18',
    date_label: 'X',
    time_label: 'X',
    party_size: 1,
    total: 1,
    host_share: 1,
  });
  assert(error, 'anon insert succeeded — RLS is not protecting writes');
  return 'rejected';
});

// --- 4. auth, triggers, CRUD ------------------------------------------

section('4. Auth, triggers and CRUD');

const stamp = Date.now();
const email = `patra.verify.${stamp}@example.com`;
const password = `Verify-${stamp}!`;
let userId = null;

await check('user registration creates an auth user', async () => {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'Verification Traveller' },
  });
  assert(!error, error?.message ?? 'createUser failed');
  userId = data.user.id;
  return email;
});

await check('handle_new_user created a profile row', async () => {
  const { data, error } = await admin
    .from('profiles')
    .select('id, email, full_name')
    .eq('id', userId)
    .maybeSingle();
  assert(!error, error?.message ?? 'query failed');
  assert(data, 'no profile row was created by the trigger');
  assert(
    data.full_name === 'Verification Traveller',
    `full_name not carried through: ${data.full_name}`
  );
  return data.email;
});

await check('handle_new_profile created user_settings', async () => {
  const { data, error } = await admin
    .from('user_settings')
    .select('user_id, language')
    .eq('user_id', userId)
    .maybeSingle();
  assert(!error, error?.message ?? 'query failed');
  assert(data, 'no user_settings row was created');
  return data.language;
});

await check('a new account fabricates no bookings', async () => {
  const { count, error } = await admin
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  assert(!error, error?.message ?? 'query failed');
  assert(count === 0, `a new account started with ${count} bookings`);
  return 'starts empty, as guest booking requires';
});

await check('seed_demo_data_for_user populates a demo account', async () => {
  const { error: seedError } = await admin.rpc('seed_demo_data_for_user', {
    p_user: userId,
  });
  assert(!seedError, seedError?.message ?? 'seed rpc failed');
  const { data, error } = await admin
    .from('bookings')
    .select('date_label, status')
    .eq('user_id', userId);
  assert(!error, error?.message ?? 'query failed');
  assert(data.length === 3, `expected 3 seeded bookings, found ${data.length}`);
  return data.map((b) => `${b.date_label} (${b.status})`).join(' · ');
});

await check('seed created conversations and messages', async () => {
  const { data, error } = await admin
    .from('conversations')
    .select('id, unread, messages(id)')
    .eq('user_id', userId);
  assert(!error, error?.message ?? 'query failed');
  assert(data.length === 2, `expected 2 conversations, found ${data.length}`);
  const total = data.reduce((n, c) => n + c.messages.length, 0);
  assert(total === 4, `expected 4 messages, found ${total}`);
  return `${data.length} conversations, ${total} messages`;
});

// A signed-in client, so the rest runs through RLS exactly as the app does.
const asUser = createClient(URL, ANON, {
  auth: { persistSession: false, autoRefreshToken: false },
});

await check('email/password sign in', async () => {
  const { data, error } = await asUser.auth.signInWithPassword({
    email,
    password,
  });
  assert(!error, error?.message ?? 'sign in failed');
  assert(data.session, 'no session returned');
  return `session for ${data.user.email}`;
});

await check('signed-in traveller reads only their own bookings', async () => {
  const { data, error } = await asUser.from('bookings').select('id, user_id');
  assert(!error, error?.message ?? 'query failed');
  assert(data.length === 3, `expected 3, found ${data.length}`);
  assert(
    data.every((b) => b.user_id === userId),
    'a booking belonging to another traveller leaked through RLS'
  );
  return `${data.length} own bookings`;
});

let createdBookingId = null;

await check('booking create writes a real row', async () => {
  const { data: exp } = await asUser
    .from('experiences')
    .select('id')
    .eq('slug', 'exp-01')
    .single();

  const { data, error } = await asUser
    .from('bookings')
    .insert({
      user_id: userId,
      experience_id: exp.id,
      day: '2026-06-19',
      date_label: 'FRIDAY 19 JUNE',
      time_label: 'Nine in the morning',
      party_size: 2,
      total: 750000,
      host_share: 600000,
      payment_method: 'pm-qris',
    })
    .select('id, date_label')
    .single();

  assert(!error, error?.message ?? 'insert failed');
  createdBookingId = data.id;
  return data.date_label;
});

await check('booking detail reads back', async () => {
  const { data, error } = await asUser
    .from('bookings')
    .select('date_label, time_label, experiences!inner(hosts!inner(name))')
    .eq('id', createdBookingId)
    .single();
  assert(!error, error?.message ?? 'query failed');
  return `${data.date_label} with ${data.experiences.hosts.name}`;
});

await check('booking status update persists', async () => {
  const { error } = await asUser
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', createdBookingId);
  assert(!error, error?.message ?? 'update failed');

  const { data } = await asUser
    .from('bookings')
    .select('status')
    .eq('id', createdBookingId)
    .single();
  assert(data.status === 'cancelled', `status is ${data.status}`);
  return 'upcoming → cancelled';
});

await check('sending a message stores it', async () => {
  const { data: conv } = await asUser
    .from('conversations')
    .select('id')
    .limit(1)
    .single();

  const { data, error } = await asUser
    .from('messages')
    .insert({
      conversation_id: conv.id,
      author: 'traveller',
      body: 'Verification message.',
    })
    .select('id, body')
    .single();
  assert(!error, error?.message ?? 'insert failed');

  const { data: readBack } = await asUser
    .from('messages')
    .select('body')
    .eq('id', data.id)
    .single();
  assert(readBack.body === 'Verification message.', 'message did not persist');
  return 'written and read back';
});

await check('profile update persists', async () => {
  const { error } = await asUser
    .from('profiles')
    .update({ full_name: 'Updated Traveller' })
    .eq('id', userId);
  assert(!error, error?.message ?? 'update failed');

  const { data } = await asUser
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .single();
  assert(data.full_name === 'Updated Traveller', `got ${data.full_name}`);
  return data.full_name;
});

await check('updated_at trigger fired on profiles', async () => {
  const { data } = await admin
    .from('profiles')
    .select('created_at, updated_at')
    .eq('id', userId)
    .single();
  assert(
    new Date(data.updated_at) > new Date(data.created_at),
    'updated_at did not advance'
  );
  return 'updated_at > created_at';
});

await check('sign out clears the session', async () => {
  const { error } = await asUser.auth.signOut();
  assert(!error, error?.message ?? 'sign out failed');
  const { data } = await asUser.auth.getSession();
  assert(!data.session, 'session survived sign out');
  return 'session cleared';
});

// --- 5. orphan sweep ---------------------------------------------------

section('5. Orphan sweep');

await check('no messages without a conversation', async () => {
  const { data, error } = await admin
    .from('messages')
    .select('id, conversations(id)');
  assert(!error, error?.message ?? 'query failed');
  const orphans = data.filter((m) => !m.conversations);
  assert(orphans.length === 0, `${orphans.length} orphaned messages`);
  return `${data.length} messages, 0 orphans`;
});

await check('no bookings without an experience', async () => {
  const { data, error } = await admin
    .from('bookings')
    .select('id, experiences(id)');
  assert(!error, error?.message ?? 'query failed');
  const orphans = data.filter((b) => !b.experiences);
  assert(orphans.length === 0, `${orphans.length} orphaned bookings`);
  return `${data.length} bookings, 0 orphans`;
});

// --- cleanup -----------------------------------------------------------

section('6. Cleanup');

await check('verification user removed (cascade)', async () => {
  const { error } = await admin.auth.admin.deleteUser(userId);
  assert(!error, error?.message ?? 'delete failed');

  const { count } = await admin
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  assert(count === 0, `${count} bookings survived the cascade`);
  return 'user and owned rows deleted';
});

// --- summary -----------------------------------------------------------

console.log(`\n${'='.repeat(58)}`);
console.log(`  ${pass} passed, ${failures.length} failed`);
if (failures.length) {
  console.log('\n  Failures:');
  for (const f of failures) console.log(`   - ${f.name}: ${f.message}`);
}
console.log(`${'='.repeat(58)}\n`);

process.exit(failures.length ? 1 : 0);
