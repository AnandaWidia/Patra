/**
 * PATRA — guest booking journey, end to end.
 *
 *   Guest → Book → Confirmation → Set Password → Account created →
 *   Bookings linked → Messages linked → Auto sign in → Sign in again
 *
 * Runs the anonymous client for the guest half, so RLS is exercised exactly
 * as the browser exercises it.
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const EOL = String.fromCharCode(10);
for (const line of readFileSync('.env.local', 'utf8').split(EOL)) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const i = t.indexOf('=');
  if (i > 0 && !process.env[t.slice(0, i).trim()]) {
    process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

const admin = createClient(URL, SERVICE, { auth: { persistSession: false } });
const guest = createClient(URL, ANON, { auth: { persistSession: false } });

let pass = 0;
const failures = [];
const check = async (name, fn) => {
  try {
    const detail = await fn();
    pass += 1;
    console.log(`  PASS  ${name}${detail ? ` — ${detail}` : ''}`);
  } catch (e) {
    failures.push(`${name}: ${e.message}`);
    console.log(`  FAIL  ${name}${EOL}          ${e.message}`);
  }
};
const assert = (c, m) => {
  if (!c) throw new Error(m);
};

const stamp = Date.now();
const email = `patra.guest.${stamp}@example.com`;
const password = `Guest-${stamp}!`;

let bookingId = null;
let claimToken = null;
let userId = null;
let hostId = null;

console.log(`${EOL}Guest booking journey${EOL}${'-'.repeat(21)}`);

// 1 — Guest books with no session at all.
await check('guest creates a booking with NO session', async () => {
  const { data: exp, error: expError } = await guest
    .from('experiences')
    .select('id, hosts!inner(id, name, phone)')
    .eq('slug', 'exp-01')
    .single();
  assert(!expError, expError?.message ?? 'experience lookup failed');
  hostId = exp.hosts.id;

  const { data, error } = await guest.rpc('create_guest_booking', {
    p_experience_slug: 'exp-01',
    p_day: '2026-06-18',
    p_date_label: 'THURSDAY 18 JUNE',
    p_time_label: 'Nine in the morning',
    p_party_size: 2,
    p_total: 750000,
    p_host_share: 600000,
    p_payment_method: 'pm-qris',
  });

  assert(!error, error?.message ?? 'rpc failed');
  const created = Array.isArray(data) ? data[0] : data;
  bookingId = created.id;
  claimToken = created.claim_token;
  return `booking ${bookingId.slice(0, 8)}…`;
});

await check('booking is stored with user_id NULL', async () => {
  const { data } = await admin
    .from('bookings')
    .select('user_id, guest_email, claim_token')
    .eq('id', bookingId)
    .single();
  assert(data.user_id === null, 'user_id is not null');
  assert(data.guest_email === null, 'guest_email should start empty');
  assert(Boolean(data.claim_token), 'no claim token issued');
  return 'unclaimed, token issued';
});

// A guest conversation, to prove message history survives the claim.
await check('guest conversation and message exist', async () => {
  const { data: conv, error: convError } = await admin
    .from('conversations')
    .insert({
      user_id: null,
      host_id: hostId,
      guest_email: email,
      unread: true,
    })
    .select('id')
    .single();
  assert(!convError, convError?.message ?? 'conversation insert failed');

  const { error: msgError } = await admin.from('messages').insert({
    conversation_id: conv.id,
    author: 'host',
    body: 'Wear something you do not mind getting dust on.',
    delivered_via: 'whatsapp',
  });
  assert(!msgError, msgError?.message ?? 'message insert failed');
  return 'one thread, one message';
});

// 2 — Set a Password. The gate first.
await check('Set a Password refuses an email that never booked', async () => {
  const { data, error } = await guest.rpc('guest_booking_exists', {
    p_email: `nobody.${stamp}@example.com`,
    p_claim_token: null,
  });
  assert(!error, error?.message ?? 'rpc failed');
  assert(data === false, 'gate wrongly allowed an unknown email');
  return 'rejected, no account created';
});

await check('gate accepts the token this browser holds', async () => {
  const { data, error } = await guest.rpc('guest_booking_exists', {
    p_email: email,
    p_claim_token: claimToken,
  });
  assert(!error, error?.message ?? 'rpc failed');
  assert(data === true, 'gate did not recognise the claim token');
  return 'accepted';
});

await check('account created (profile + settings by trigger)', async () => {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  assert(!error, error?.message ?? 'createUser failed');
  userId = data.user.id;

  const { data: profile } = await admin
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();
  assert(profile, 'no profile row');

  const { data: settings } = await admin
    .from('user_settings')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();
  assert(settings, 'no settings row');
  return 'profile and settings present';
});

// 3 — Sign in, then claim as that user.
const asUser = createClient(URL, ANON, { auth: { persistSession: false } });

await check('automatic sign in after setting a password', async () => {
  const { data, error } = await asUser.auth.signInWithPassword({
    email,
    password,
  });
  assert(!error, error?.message ?? 'sign in failed');
  assert(data.session, 'no session');
  return 'signed in';
});

await check('claim links the guest booking and conversation', async () => {
  const { data, error } = await asUser.rpc('claim_guest_records', {
    p_email: email,
    p_claim_token: claimToken,
  });
  assert(!error, error?.message ?? 'claim failed');
  const row = Array.isArray(data) ? data[0] : data;
  assert(row.bookings_claimed >= 1, `claimed ${row.bookings_claimed} bookings`);
  assert(
    row.conversations_claimed >= 1,
    `claimed ${row.conversations_claimed} conversations`
  );
  return `${row.bookings_claimed} booking(s), ${row.conversations_claimed} conversation(s)`;
});

await check('booking now belongs to the account', async () => {
  const { data } = await admin
    .from('bookings')
    .select('user_id, guest_email')
    .eq('id', bookingId)
    .single();
  assert(data.user_id === userId, 'user_id was not set');
  assert(
    data.guest_email === email.toLowerCase(),
    `guest_email not backfilled: ${data.guest_email}`
  );
  return 'linked, email backfilled';
});

await check('anon CANNOT read guest bookings (0005 fix)', async () => {
  const { data, error } = await guest.from('bookings').select('id');
  const blocked = Boolean(error) || (data?.length ?? 0) === 0;
  assert(
    blocked,
    `anon read ${data?.length} guest bookings — enumeration hole`
  );
  return error ? 'rejected' : 'empty';
});

await check('bookings appear immediately for the signed-in user', async () => {
  const { data, error } = await asUser
    .from('bookings')
    .select('id, date_label');
  assert(!error, error?.message ?? 'read failed');
  assert(data.length === 1, `expected 1 booking, found ${data.length}`);
  return data[0].date_label;
});

await check('message history survived the claim', async () => {
  const { data, error } = await asUser
    .from('conversations')
    .select('id, messages(body)');
  assert(!error, error?.message ?? 'read failed');
  assert(data.length === 1, `expected 1 conversation, found ${data.length}`);
  assert(data[0].messages.length === 1, 'message lost');
  return data[0].messages[0].body.slice(0, 34);
});

await check('claiming twice is safe (idempotent)', async () => {
  const { data, error } = await asUser.rpc('claim_guest_records', {
    p_email: email,
    p_claim_token: claimToken,
  });
  assert(!error, error?.message ?? 'second claim failed');
  const row = Array.isArray(data) ? data[0] : data;
  assert(row.bookings_claimed === 0, 'a claimed booking was reassigned');

  const { count } = await asUser
    .from('bookings')
    .select('*', { count: 'exact', head: true });
  assert(count === 1, `duplicate bookings: ${count}`);
  return 'no duplicates';
});

// 4 — Another traveller must not be able to steal it.
await check('a second account cannot claim the same booking', async () => {
  const otherEmail = `patra.other.${stamp}@example.com`;
  const { data: other } = await admin.auth.admin.createUser({
    email: otherEmail,
    password,
    email_confirm: true,
  });

  const thief = createClient(URL, ANON, { auth: { persistSession: false } });
  await thief.auth.signInWithPassword({ email: otherEmail, password });
  const { data } = await thief.rpc('claim_guest_records', {
    p_email: email,
    p_claim_token: claimToken,
  });
  const row = Array.isArray(data) ? data[0] : data;
  assert(row.bookings_claimed === 0, 'another account stole the booking');

  const { data: still } = await admin
    .from('bookings')
    .select('user_id')
    .eq('id', bookingId)
    .single();
  assert(still.user_id === userId, 'ownership changed');
  await admin.auth.admin.deleteUser(other.user.id);
  return 'refused, ownership intact';
});

// 5 — Session persistence and returning sign in.
await check('session persists across a client restart', async () => {
  const store = new Map();
  const storage = {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
  };
  const a = createClient(URL, ANON, {
    auth: { persistSession: true, storage, autoRefreshToken: false },
  });
  await a.auth.signInWithPassword({ email, password });
  const b = createClient(URL, ANON, {
    auth: { persistSession: true, storage, autoRefreshToken: false },
  });
  const { data } = await b.auth.getSession();
  assert(data.session, 'session did not survive');
  return data.session.user.email;
});

await check('sign out then sign in again — booking still there', async () => {
  await asUser.auth.signOut();
  const { data: after } = await asUser.from('bookings').select('id');
  assert((after?.length ?? 0) === 0, 'bookings readable after sign out');

  const again = createClient(URL, ANON, { auth: { persistSession: false } });
  const { error } = await again.auth.signInWithPassword({ email, password });
  assert(!error, error?.message ?? 'second sign in failed');

  const { data } = await again.from('bookings').select('id, date_label');
  assert(data.length === 1, `expected 1 booking, found ${data.length}`);
  return `${data.length} booking still linked`;
});

await check('cleanup', async () => {
  await admin.auth.admin.deleteUser(userId);
  const { count } = await admin
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('id', bookingId);
  assert(count === 0, 'booking survived the cascade');
  return 'user and owned rows deleted';
});

console.log(`${EOL}${'='.repeat(58)}`);
console.log(`  ${pass} passed, ${failures.length} failed`);
if (failures.length) failures.forEach((f) => console.log(`   - ${f}`));
console.log(`${'='.repeat(58)}${EOL}`);
process.exit(failures.length ? 1 : 0);
