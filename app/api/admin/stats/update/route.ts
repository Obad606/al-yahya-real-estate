import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function serverClient(req: NextRequest, res: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );
}

export async function POST(req: NextRequest) {
  const res = NextResponse.json({});
  const supabase = serverClient(req, res);

  // تحقق المستخدم
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse(JSON.stringify({ success: false, error: "غير مصرح" }), {
      status: 401,
      headers: res.headers,
    });
  }

  // تحقق صلاحيات الإداري (RLS قد يغطي هذا؛ أبقيته كتحقق إضافي)
  const { data: me } = await supabase
    .from("admin_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!me?.is_active || !["super_admin", "admin"].includes(me.role)) {
    return new NextResponse(JSON.stringify({ success: false, error: "صلاحية غير كافية" }), {
      status: 403,
      headers: res.headers,
    });
  }

  const body = await req.json();

  const toNum = (v: any) =>
    v === "" || v === null || v === undefined ? undefined : Number(v);

  const years   = toNum(body?.years_experience);
  const awards  = toNum(body?.awards_count);
  const clients = toNum(body?.clients_count);

  if (years === undefined && awards === undefined && clients === undefined) {
    return new NextResponse(JSON.stringify({ success: false, error: "لا توجد قيم صالحة للتحديث" }), {
      status: 400,
      headers: res.headers,
    });
  }

  const payload: Record<string, number | string> = {};
  if (years   !== undefined && !Number.isNaN(years))   payload.years_experience = years;
  if (awards  !== undefined && !Number.isNaN(awards))  payload.awards_count = awards;
  if (clients !== undefined && !Number.isNaN(clients)) payload.clients_count = clients;
  payload.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from("site_statistics")
    .update(payload)
    .eq("id", 1);

  if (error) {
    return new NextResponse(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: res.headers,
    });
  }

  return new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: res.headers,
  });
}
