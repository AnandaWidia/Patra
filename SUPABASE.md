# PATRA — Supabase Setup

Authentication milestone. Everything is implemented and building; the only
thing missing is your project's credentials. Once you paste them in, no code
changes are needed.

Until then the application runs exactly as it did before: the session layer
falls back to the mock traveller and every frozen screen is untouched.

---

## 1. Packages installed

```
@supabase/supabase-js   ^2.110.8
@supabase/ssr           ^0.12.3
```

Already in `package.json` — `npm install` picks them up.

---

## 2. Create the Supabase project

1. Go to <https://supabase.com/dashboard> and create a project.
2. Pick a region close to your users — **Southeast Asia (Singapore)** is the
   nearest to Bali.
3. Save the database password somewhere safe. You will not need it for this
   milestone, but you cannot recover it later.

---

## 3. Values to copy from the Dashboard

**Project Settings → API**

| Dashboard field | Goes into `.env.local` as | Exposed to browser |
| --- | --- | --- |
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | yes |
| `anon` `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes |
| `service_role` `secret` key | `SUPABASE_SERVICE_ROLE_KEY` | **never** |

```bash
cp .env.example .env.local
```

Then paste the three values in. `.env.local` is gitignored; `.env.example`
is deliberately kept in version control as the template.

The `anon` key is safe in the browser — row level security is what protects
the data, which is why the migration below matters. The `service_role` key
bypasses RLS entirely and must stay server-side.

---

## 4. Migration to run

One file:

```
supabase/migrations/0001_profiles.sql
```

**Dashboard → SQL Editor → New query** → paste the file → **Run**.

Or with the CLI:

```bash
supabase db push
```

It creates:

- `public.profiles` — `id`, `email`, `full_name`, `phone`, `avatar_url`,
  `role`, `created_at`, `updated_at`
- Row level security, so a traveller can read and edit **only their own row**
- `handle_new_user()` + trigger on `auth.users` — a profile row is created
  automatically the moment someone signs up, so the Account tab is never empty
- `set_updated_at()` + trigger
- A backfill for any users that already exist

No other tables. Experiences, bookings, messages and the calendar stay as mock
JSON in `/data`, as specified.

---

## 5. Auth settings in the Dashboard

**Authentication → URL Configuration**

- **Site URL**: `http://localhost:3000` for development
- **Redirect URLs**: add `http://localhost:3000/auth/callback`

Without that second entry the confirmation and password-reset emails will
bounce the traveller to an error page.

**Authentication → Providers → Email** — leave enabled.

For a thesis demo, consider turning **"Confirm email"** *off* while testing so
sign-up gives you a session immediately. With it on, the code handles it
correctly: Set a Password shows *"Check your email to confirm the address,
then sign in."* rather than pretending to succeed.

---

## 6. Final steps

```bash
npm install
npm run dev
```

The app switches to real authentication automatically the moment
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are present and
valid. **Restart the dev server after editing `.env.local`** — Next.js only
reads env files at startup.

To confirm it is live: open **Account → Set a password**, create an account,
and check **Dashboard → Table Editor → profiles**. A row should be there
already, created by the trigger.

---

## What was built

| File | Purpose |
| --- | --- |
| `lib/supabase/config.ts` | Env reading, `isSupabaseConfigured`, route lists |
| `lib/supabase/client.ts` | Browser client (cookie sessions, auto refresh) |
| `lib/supabase/server.ts` | Server client + service-role client |
| `lib/supabase/middleware.ts` | Session refresh and route protection |
| `middleware.ts` | Wires the above into every request |
| `lib/auth/actions.ts` | Server actions: sign in, sign up, reset, update, sign out |
| `lib/auth/profile.ts` | Maps a `profiles` row onto the §09 `User` shape |
| `app/auth/callback/route.ts` | Handles confirmation and reset links |
| `contexts/session-context.tsx` | Same public API as the mock; real auth underneath |
| `types/database.ts` | `profiles` types |
| `supabase/migrations/0001_profiles.sql` | The one migration |
| `.env.example` | Credential template |

### Route protection

The mechanism is implemented in `lib/supabase/middleware.ts` and driven by
`PROTECTED_ROUTES` in `lib/supabase/config.ts`. Unauthenticated visitors to a
protected path are redirected to `/sign-in?redirectTo=…`, and signed-in users
are bounced off `/sign-in` and `/reset-password` back to `/profile`.

**`PROTECTED_ROUTES` is deliberately empty.** §02 is explicit: *"Authentication
never blocks booking. Guest checkout is a frozen product decision: no password
is required to book."* Redirecting a traveller away from Explore, Choose a Day
or Checkout would contradict a frozen product decision, and `/profile` already
has a designed signed-out state (frame 2:3281) rather than a redirect.

To protect a path, add its prefix to that array — one line, no other change:

```ts
export const PROTECTED_ROUTES: readonly string[] = ['/bookings'];
```

### One addition to the frozen screens

Sign In, Set a Password and Reset Password each gained a single error line,
rendered in the existing `platform/meta` role at `text/secondary` and shown
**only after a failed submit**. In their resting state the screens are
pixel-identical to the frames.

This is not new design: §08 specifies *"Sign In / Set / Reset — LOADING:
inline on submit, ERROR: field-level, plain language"*, and the frames simply
never drew that state. The copy follows the §08 rule that errors never use
`voice/refusal` — a wrong password is not a village closing its compound.

The submit buttons also show inline progress text while pending ("Signing
in", "Sending the link"), which is the §08 loading state for this screen
class.
