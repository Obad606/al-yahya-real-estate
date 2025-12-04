// C:\Users\Dell\Downloads\code\lib\supabase-admin.ts
// عميل Service Role — استخدمه فقط في المسارات السيرفرية (Route handlers / Edge functions)
// ⚠️ لا تُصدّره إلى الواجهة.

import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
}

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false },
  }
);
