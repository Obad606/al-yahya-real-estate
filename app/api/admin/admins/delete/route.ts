// C:\Users\Dell\Downloads\code\app\api\admin\admins\delete\route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({});

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name: string, options: any) => {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse(JSON.stringify({ success: false, error: "غير مصرح" }), { status: 401, headers: res.headers });

  const { user_id } = await req.json();
  if (!user_id) return new NextResponse(JSON.stringify({ success: false, error: "user_id مفقود" }), { status: 400, headers: res.headers });

  // تحقق أن المنفذ سوبر أدمن
  const { data: me } = await supabase
    .from("admin_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!me?.is_active || me.role !== "super_admin") {
    return new NextResponse(JSON.stringify({ success: false, error: "صلاحية غير كافية" }), { status: 403, headers: res.headers });
  }

  // حذف ملف الإداري + حذف المستخدم من Auth (ترتيب: احذف البروفايل ثم المستخدم)
  const { error: delProfileErr } = await supabaseAdmin
    .from("admin_profiles")
    .delete()
    .eq("user_id", user_id);

  if (delProfileErr) {
    return new NextResponse(JSON.stringify({ success: false, error: delProfileErr.message }), { status: 400, headers: res.headers });
  }

  const { error: delUserErr } = await supabaseAdmin.auth.admin.deleteUser(user_id);
  if (delUserErr) {
    return new NextResponse(JSON.stringify({ success: false, error: delUserErr.message }), { status: 400, headers: res.headers });
  }

  return new NextResponse(JSON.stringify({ success: true }), { status: 200, headers: res.headers });
}
