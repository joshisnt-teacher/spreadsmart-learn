import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_CENTRAL_SUPABASE_URL;
const key = import.meta.env.VITE_CENTRAL_SUPABASE_ANON_KEY;

if (!url || !key) throw new Error('Missing central Supabase env vars');

export const centralSupabase = createClient(url, key);
