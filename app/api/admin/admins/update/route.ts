import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse(JSON.stringify({ success: false, error: "غير مصرح" }), {
      status: 401,
      headers: res.headers,
    });
  }

  // التحقق من صلاحيات المنفّذ (لازم يكون super_admin ومفعّل)
  const { data: me, error: meErr } = await supabase
    .from("admin_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (meErr || !me?.is_active || me.role !== "super_admin") {
    return new NextResponse(JSON.stringify({ success: false, error: "صلاحية غير كافية" }), {
      status: 403,
      headers: res.headers,
    });
  }

  const body = await req.json();
  const { user_id, is_active } = body ?? {};
  if (!user_id || typeof is_active !== "boolean") {
    return new NextResponse(JSON.stringify({ success: false, error: "بيانات غير صالحة" }), {
      status: 400,
      headers: res.headers,
    });
  }

  // لا تغيّر حالتك بنفسك لتفادي قفل نفسك
  if (user_id === user.id) {
    return new NextResponse(JSON.stringify({ success: false, error: "لا يمكنك تغيير حالتك بنفسك" }), {
      status: 400,
      headers: res.headers,
    });
  }

  // ✅ تحديث admin_profiles فقط — لا حذف، لا لمس auth.users
  const { error: updErr } = await supabase
    .from("admin_profiles")
    .update({ is_active })
    .eq("user_id", user_id);

  if (updErr) {
    return new NextResponse(JSON.stringify({ success: false, error: updErr.message }), {
      status: 500,
      headers: res.headers,
    });
  }

  return new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: res.headers,
  });
}
