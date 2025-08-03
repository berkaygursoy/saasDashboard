import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ndhtbrtbslsknlnacxen.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// API anahtarı eksikse uyarı ver
if (!supabaseKey) {
  console.warn("Supabase API anahtarı bulunamadı. Lütfen .env dosyasında VITE_SUPABASE_KEY tanımlayın.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
