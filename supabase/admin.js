import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // or SUPABASE_SECRET_KEY
if (!supabaseUrl || !supabaseAdminKey) {
  throw new Error("Missing Supabase URL or service/secret key");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseAdminKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
