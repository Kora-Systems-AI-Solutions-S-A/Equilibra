import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Captura o hash original antes de o SDK do Supabase o limpar automaticamente.
// Usamos 'let' para permitir o reset após o consumo na store.
export let initialLocationHash = typeof window !== 'undefined' ? window.location.hash : '';

export const resetInitialHash = () => {
  initialLocationHash = '';
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'As credenciais do Supabase não foram encontradas. Verifique se o arquivo .env está configurado com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      debug: false,
    },
  }
);
