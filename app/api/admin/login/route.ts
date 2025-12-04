import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  // مهم: بنستعمل نفس الـ res في كل الردود عشان يحافظ على الكوكيز اللي تضبطها supabase
  const res = NextResponse.json({}); // سنملأه لاحقًا بالنتيجة الفعلية

  try {
    const { email, password } = await req.json();

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

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      // نعيد 401 باستخدام نفس res (حتى لو ما فيه كوكيز)
      return new NextResponse(
        JSON.stringify({ success: false, error: "البريد أو كلمة المرور غير صحيحة" }),
        { status: 401, headers: res.headers }
      );
    }

    // التحقق من أن المستخدم إداري ومفعّل
    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("user_id, full_name, email, phone, role, is_active")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (!profile || !profile.is_active) {
      await supabase.auth.signOut();
      return new NextResponse(
        JSON.stringify({ success: false, error: "الحساب غير مخوّل للوصول" }),
        { status: 403, headers: res.headers }
      );
    }

    // نجاح: أعد الرد باستخدام نفس res (يحمل الكوكيز)
    return new NextResponse(
      JSON.stringify({
        success: true,
        admin: {
          id: data.user.id,
          name: profile.full_name,
          email: data.user.email,
          role: profile.role,
        },
      }),
      { status: 200, headers: res.headers }
    );
  } catch (e) {
    console.error("Login error:", e);
    return new NextResponse(
      JSON.stringify({ success: false, error: "حدث خطأ في الخادم" }),
      { status: 500, headers: res.headers }
    );
  }
}
