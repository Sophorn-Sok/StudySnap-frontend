import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let warnedMissingServiceRole = false;

export function createSupabaseClient(authToken?: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables.');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: authToken
      ? {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      : undefined,
  });
}

export function createSupabaseAdminClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables.');
  }

  if (!supabaseServiceRoleKey && !warnedMissingServiceRole) {
    warnedMissingServiceRole = true;
    console.warn(
      '[Supabase] SUPABASE_SERVICE_ROLE_KEY is missing. Admin client is using anon key and writes may fail when RLS is enabled.'
    );
  }

  // Prefer service-role for server-side API routes so custom auth + RLS doesn't block writes.
  const key = supabaseServiceRoleKey ?? supabaseAnonKey;

  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

