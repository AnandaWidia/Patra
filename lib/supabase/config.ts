/**
 * Supabase environment configuration.
 *
 * Credentials are never hardcoded. Until they are supplied the application
 * still runs: `isSupabaseConfigured` is false, the session layer falls back to
 * the mock profile, and every frozen screen renders exactly as before. Adding
 * the real values to `.env.local` is the only step needed to switch the
 * application to real authentication — no code change.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** Placeholder values shipped in .env.example must not count as configured. */
const PLACEHOLDERS = ['', 'your-project-url', 'your-anon-key'];

export function isSupabaseConfigured(): boolean {
  return (
    !PLACEHOLDERS.includes(SUPABASE_URL) &&
    !PLACEHOLDERS.includes(SUPABASE_ANON_KEY) &&
    SUPABASE_URL.startsWith('http')
  );
}

/**
 * §02 — "Authentication never blocks booking. Guest checkout is a frozen
 * product decision: no password is required to book... Sign In is reached
 * from Profile only."
 *
 * So this list is deliberately empty. Redirecting an unauthenticated
 * traveller away from Explore, Choose a Day or Checkout would contradict a
 * frozen product decision, and /profile already has a designed signed-out
 * state (frame 2:3281) rather than a redirect.
 *
 * The mechanism is fully implemented: add a path prefix here and middleware
 * will redirect unauthenticated visitors to Sign In, preserving their
 * destination in `?redirectTo=`.
 */
export const PROTECTED_ROUTES: readonly string[] = [];

/** Signed-in users are bounced off these back to Profile. */
export const AUTH_ROUTES: readonly string[] = ['/sign-in', '/reset-password'];

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function isAuthPath(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
