import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// This connects your app to your specific earlymusic database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
