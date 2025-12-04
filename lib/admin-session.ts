// C:\Users\Dell\Downloads\code\lib\admin-session.ts
// Helpers (سيرفر فقط) للحصول على المستخدم الحالي وملفه الإداري من Supabase عبر كوكيز HttpOnly.

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

type AdminProfile = {
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: "super_admin" | "admin";
  is_active: boolean;
};

function getServerSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        // في سياق سيرفري بحت، نحن لا نعدّل الكوكيز هنا
        set() {},
        remove() {},
      },
    }
  );
}

/**
 * إرجاع المستخدم الحالي وملفه الإداري (إن وجد)
 * لا ترمي Redirect — فقط ترجع null لو ما في جلسة.
 */
export async function getAdminContext() {
  const supabase = getServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null as AdminProfile | null };

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("user_id, full_name, email, phone, role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  return { user, profile: (profile as AdminProfile | null) ?? null };
}
