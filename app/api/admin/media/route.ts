import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase-admin";

// ⚠️ هذا الملف كان مكرّر مرتين — لا تترك أي تكرار أسفله

// فحص الصلاحيات: لازم يكون super_admin ومفعّل
async function assertSuperAdmin() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, status: 401, msg: "غير مصرح" };

  const { data: me, error } = await supabase
    .from("admin_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !me?.is_active || me.role !== "super_admin") {
    return { ok: false, status: 403, msg: "صلاحية غير كافية" };
  }
  return { ok: true };
}

export async function GET() {
  const auth = await assertSuperAdmin();
  if (!auth.ok) return NextResponse.json({ success: false, error: auth.msg }, { status: auth.status });

  // نستخدم Service Role لنتجاوز RLS في صفحات الإدارة
  const { data, error } = await supabaseAdmin
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function POST(req: Request) {
  const auth = await assertSuperAdmin();
  if (!auth.ok) return NextResponse.json({ success: false, error: auth.msg }, { status: auth.status });

  const body = await req.json();

  // تحقق بسيط للمدخلات
  const payload = {
    type: String(body?.type || "news"),
    title: String(body?.title || ""),
    excerpt: body?.excerpt ?? null,
    description: body?.description ?? null,
    image_url: body?.image_url || null,
    video_url: body?.video_url || null,
    pdf_url: body?.pdf_url || null,
  };
  if (!payload.title.trim()) {
    return NextResponse.json({ success: false, error: "العنوان مطلوب" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("media")
    .insert([payload])
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}
