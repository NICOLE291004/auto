import "server-only";
import { createClient } from "@supabase/supabase-js";

/** Cliente con service role. Solo en el servidor; se salta RLS. */
export function supabaseServicio() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
