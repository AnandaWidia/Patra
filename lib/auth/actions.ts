'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';

/**
 * Authentication server actions.
 *
 * §08 error copy rule, binding: "never use voice/refusal... State what
 * happened, state what was not charged or lost, and offer recovery where
 * recovery exists." Messages here are therefore plain, specific and never
 * blame the traveller.
 */
export interface AuthResult {
  ok: boolean;
  message?: string;
}

const NOT_CONFIGURED: AuthResult = {
  ok: false,
  message:
    'Sign in is not connected yet. Add your Supabase keys to .env.local and restart.',
};

/** Plain-language mapping for the errors Supabase actually returns. */
function readableError(message: string): string {
  const text = message.toLowerCase();
  if (text.includes('invalid login credentials')) {
    return 'That email and password do not match an account.';
  }
  if (text.includes('email not confirmed')) {
    return 'Check your email and open the confirmation link first.';
  }
  if (text.includes('user already registered')) {
    return 'That email already has a password. Sign in instead.';
  }
  if (text.includes('password should be at least')) {
    return 'Use at least six characters.';
  }
  if (text.includes('rate limit') || text.includes('too many')) {
    return 'Too many attempts. Wait a moment and try again.';
  }
  return message;
}

async function siteOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, '');

  const headerList = await headers();
  const host = headerList.get('host') ?? 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

/** Sign In — frame 2:3190. */
export async function signInWithPassword(
  email: string,
  password: string
): Promise<AuthResult> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { ok: false, message: readableError(error.message) };

  revalidatePath('/', 'layout');
  return { ok: true };
}

/**
 * Set a Password — frame 2:3207.
 *
 * §03 — "Post-booking only. Identity already verified." So this creates the
 * account for a traveller who has already booked as a guest. If they turn out
 * to already have one, it falls through to signing them in rather than
 * refusing.
 */
export async function signUpWithPassword(
  email: string,
  password: string,
  fullName?: string
): Promise<AuthResult> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const supabase = await createClient();
  const origin = await siteOrigin();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      // Read by the handle_new_user trigger to seed the profile row.
      data: fullName ? { full_name: fullName } : undefined,
    },
  });

  if (error) return { ok: false, message: readableError(error.message) };

  // Email confirmation is on and no session was issued.
  if (!data.session) {
    return {
      ok: true,
      message: 'Check your email to confirm the address, then sign in.',
    };
  }

  revalidatePath('/', 'layout');
  return { ok: true };
}

/** Reset Password — frame 2:3222. §03 — "Emailed link, one hour validity." */
export async function requestPasswordReset(email: string): Promise<AuthResult> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const supabase = await createClient();
  const origin = await siteOrigin();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/set-password`,
  });

  if (error) return { ok: false, message: readableError(error.message) };
  return { ok: true };
}

/** Completes a reset once the emailed link has established a session. */
export async function updatePassword(password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { ok: false, message: readableError(error.message) };

  revalidatePath('/', 'layout');
  return { ok: true };
}

/** Sign out. §03 — "Sign out link switches to signed-out state." */
export async function signOut(): Promise<AuthResult> {
  if (!isSupabaseConfigured()) return { ok: true };

  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) return { ok: false, message: readableError(error.message) };

  revalidatePath('/', 'layout');
  return { ok: true };
}
