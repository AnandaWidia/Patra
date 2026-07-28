/**
 * PATRA — one-shot Supabase bootstrap.
 *
 *   SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/bootstrap-supabase.mjs
 *
 * With a Personal Access Token this does everything that would otherwise be
 * manual:
 *
 *   1. fetches the project's anon and service_role keys
 *   2. writes .env.local
 *   3. applies every migration in supabase/migrations, in order
 *   4. runs supabase/seed.sql
 *   5. reports what landed in the database
 *
 * SQL runs through the Management API's query endpoint — the same one the
 * Dashboard SQL Editor uses — so no database password is needed.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF ?? 'moipjvcszjwhwdebowve';
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const API = 'https://api.supabase.com';

if (!TOKEN) {
  console.error(
    '\n  SUPABASE_ACCESS_TOKEN is not set.\n' +
      '  Create one at https://supabase.com/dashboard/account/tokens\n' +
      '  then run:  $env:SUPABASE_ACCESS_TOKEN="sbp_..."; node scripts/bootstrap-supabase.mjs\n'
  );
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function api(path, init = {}) {
  const res = await fetch(`${API}${path}`, { ...init, headers });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${res.status} ${path}\n  ${text.slice(0, 400)}`);
  }
  return text ? JSON.parse(text) : null;
}

/** Runs SQL through the Management API query endpoint. */
async function runSql(sql) {
  return api(`/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    body: JSON.stringify({ query: sql }),
  });
}

// --- 1. project + keys -------------------------------------------------

console.log(`\nProject: ${PROJECT_REF}`);

const project = await api(`/v1/projects/${PROJECT_REF}`);
console.log(`  name:   ${project.name}`);
console.log(`  region: ${project.region}`);
console.log(`  status: ${project.status}`);

const keys = await api(`/v1/projects/${PROJECT_REF}/api-keys?reveal=true`);
const find = (name) => keys.find((k) => k.name === name)?.api_key;

const anon = find('anon');
const service = find('service_role');

if (!anon || !service) {
  throw new Error(
    `Could not read both keys. Got: ${keys.map((k) => k.name).join(', ')}`
  );
}

console.log(`  anon key:         ${anon.slice(0, 12)}… (${anon.length} chars)`);
console.log(
  `  service_role key: ${service.slice(0, 12)}… (${service.length} chars)`
);

// --- 2. .env.local -----------------------------------------------------

const url = `https://${PROJECT_REF}.supabase.co`;
const envPath = '.env.local';

const env = `# PATRA — local environment
# Written by scripts/bootstrap-supabase.mjs. Not committed.

NEXT_PUBLIC_SUPABASE_URL=${url}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anon}
SUPABASE_SERVICE_ROLE_KEY=${service}
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`;

writeFileSync(envPath, env, 'utf8');
console.log(`\nWrote ${envPath}`);

// --- 3. migrations -----------------------------------------------------

const migrationsDir = join('supabase', 'migrations');
const files = existsSync(migrationsDir)
  ? readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort()
  : [];

console.log(`\nApplying ${files.length} migration(s)`);
for (const file of files) {
  const sql = readFileSync(join(migrationsDir, file), 'utf8');
  process.stdout.write(`  ${file} … `);
  try {
    await runSql(sql);
    console.log('OK');
  } catch (error) {
    console.log('FAILED');
    console.error(`\n${error.message}\n`);
    process.exit(1);
  }
}

// --- 4. seed -----------------------------------------------------------

const seedPath = join('supabase', 'seed.sql');
if (existsSync(seedPath)) {
  process.stdout.write('\nRunning seed.sql … ');
  try {
    await runSql(readFileSync(seedPath, 'utf8'));
    console.log('OK');
  } catch (error) {
    console.log('FAILED');
    console.error(`\n${error.message}\n`);
    process.exit(1);
  }
}

// --- 5. report ---------------------------------------------------------

console.log('\nDatabase contents');

const counts = await runSql(`
  select 'hosts' as table_name, count(*)::int from public.hosts
  union all select 'experiences', count(*)::int from public.experiences
  union all select 'experience_card_variants', count(*)::int from public.experience_card_variants
  union all select 'experience_availability', count(*)::int from public.experience_availability
  union all select 'calendar_events', count(*)::int from public.calendar_events
  union all select 'payment_rails', count(*)::int from public.payment_rails
  union all select 'reviews', count(*)::int from public.reviews
  union all select 'profiles', count(*)::int from public.profiles
  union all select 'user_settings', count(*)::int from public.user_settings
  union all select 'bookings', count(*)::int from public.bookings
  union all select 'conversations', count(*)::int from public.conversations
  union all select 'messages', count(*)::int from public.messages
  order by 1;
`);

for (const row of counts) {
  console.log(`  ${String(row.table_name).padEnd(26)} ${row.count}`);
}

const rls = await runSql(`
  select tablename, count(*)::int as policies
  from pg_policies where schemaname = 'public'
  group by tablename order by tablename;
`);
console.log(`\nRLS policies on ${rls.length} tables`);
for (const row of rls) {
  console.log(`  ${String(row.tablename).padEnd(26)} ${row.policies}`);
}

const triggers = await runSql(`
  select event_object_table as tbl, trigger_name
  from information_schema.triggers
  where trigger_schema = 'public'
  order by 1, 2;
`);
console.log(`\nTriggers: ${triggers.length}`);
for (const row of triggers) {
  console.log(`  ${String(row.tbl).padEnd(26)} ${row.trigger_name}`);
}

console.log('\nBootstrap complete. Next: npm run db:verify\n');
