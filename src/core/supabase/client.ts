import { env } from '../config/env';

// Mock Supabase client for now to prevent crashes when environment variables are missing
// This will be replaced with createClient once Supabase is fully configured
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => ({ data: { session: null }, error: new Error('Supabase not configured') }),
    signUp: async () => ({ data: { session: null }, error: new Error('Supabase not configured') }),
    signInWithOAuth: async () => ({ error: new Error('Supabase not configured') }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
      }),
    }),
  }),
};

// When Supabase is ready, it would be:
// import { createClient } from '@supabase/supabase-js';
// export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
