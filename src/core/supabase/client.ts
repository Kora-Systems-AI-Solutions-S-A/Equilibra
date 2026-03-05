import { env } from '../config/env';

// Placeholder for future Supabase client integration
// This will be used once Supabase is configured
export const supabase = {
  // Mock client for now to prevent crashes
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
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
