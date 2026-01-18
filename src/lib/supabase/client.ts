import { createClient } from "@supabase/supabase-js";

// Use fallback values during build time to prevent prerendering errors
// These will be replaced with actual values at runtime on the client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
