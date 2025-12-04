// C:\Users\Dell\Downloads\code\app\api\admin\create\route.ts
// إنشاء إداري جديد:
// 1) التأكد أن المنفّذ Super Admin
// 2) إنشاء مستخدم Auth عبر Admin API
// 3) إدراج admin_profiles
// NOTE: شغّل هذا فقط من الواجهة الإدارية المحمية.

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const { full_name, email, phone, role, password } = await req.json();

    if (!full_name || !email || !role || !password) {
      return NextResponse.json(
        { success: false, error: "بيانات غير مكتملة" },
        { status: 400 }
      );
    }
    if (!["super_admin", "admin"].includes(role)) {
      return NextResponse.json(
        { success: false, error: "دور غير صالح" },
        { status: 400 }
      );
    }

    // 1) تحقق من أنّ المنفّذ Super Admin
    const res = NextResponse.json({}); // placeholder لتحديث الكوكيز لو لزم
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const { data: me } = await supabase
      .from("admin_profiles")
      .select("role, is_active")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!me || !me.is_active || me.role !== "super_admin") {
      return NextResponse.json({ success: false, error: "صلاحية غير كافية" }, { status: 403 });
    }

    // 2) إنشاء مستخدم Auth
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,                 // كلمة مرور أولية - يمكن للمستخدم تغييرها لاحقًا
      email_confirm: true,      // اعتبر البريد مؤكّد
      user_metadata: { created_by: user.id, purpose: "admin" },
    });

    if (createErr || !created.user) {
      return NextResponse.json(
        { success: false, error: createErr?.message || "فشل إنشاء المستخدم" },
        { status: 400 }
      );
    }

    const newUserId = created.user.id;

    // 3) إدراج ملفه الإداري
    const { error: insertErr } = await supabaseAdmin
      .from("admin_profiles")
      .insert({
        user_id: newUserId,
        full_name,
        email,
        phone: phone ?? null,
        role,
        is_active: true,
      });

    if (insertErr) {
      // تنظيف المستخدم الذي تم إنشاؤه إن فشل الإدراج
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      return NextResponse.json(
        { success: false, error: "فشل إدراج الملف الإداري" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        user_id: newUserId,
        full_name,
        email,
        phone: phone ?? null,
        role,
        is_active: true,
      },
    });
  } catch (e: any) {
    console.error("Create admin error:", e);
    return NextResponse.json(
      { success: false, error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}
