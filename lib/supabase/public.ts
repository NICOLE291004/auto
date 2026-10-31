import { createClient } from "@supabase/supabase-js";

/** Cliente anónimo: solo puede leer la vista piezas_publicas. */
export function supabasePublico() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
