// C:\Users\Dell\Downloads\code\lib\supabase.ts
// عميل المتصفح للاستخدام في الواجهات (signIn / signOut ...)
// الجلسة الفعلية تُدار عبر كوكيز HttpOnly في الراوتر السيرفري.

import { createClient } from "@supabase/supabase-js";

export function createBrowserSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false, // لا نخزن في localStorage
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );
}
