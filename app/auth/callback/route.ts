import { NextResponse, type NextRequest } from 'next/server';

import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';

/**
 * Auth callback.
 *
 * Handles both links Supabase sends: the sign-up confirmation and the
 * password reset. Exchanging the code here establishes the session cookie,
 * after which the traveller lands on a real screen — never on a blank page.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/profile';

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/sign-in`);
  }

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as 'recovery' | 'signup' | 'email',
      token_hash: tokenHash,
    });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  // The link was already used or has expired. §03 gives it one hour.
  return NextResponse.redirect(`${origin}/reset-password?error=link-expired`);
}
