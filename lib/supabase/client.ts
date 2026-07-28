'use client';

import { createBrowserClient } from '@supabase/ssr';

import type { Database } from '@/types/database';

import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

/**
 * Browser Supabase client.
 *
 * Session persistence and automatic refresh are handled by @supabase/ssr:
 * tokens live in cookies so the server can read them, and the client refreshes
 * them before expiry without any application code.
 */
export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}
