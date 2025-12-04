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

export async function PATCH(req: NextRequest) {
  const res = NextResponse.json({});
  const supabase = serverClient(req, res);
  const body = await req.json();

  // تحقّق جلسة المستخدم وصلاحيته (اختياري؛ إذا كان RLS يكفي يمكنك حذف هذا)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new NextResponse(JSON.stringify({ success: false, error: "غير مصرح" }), {
      status: 401,
      headers: res.headers,
    });
  }

  // اجلب الـ id للصف الوحيد
  const { data: firstRow, error: fetchError } = await supabase
    .from("investor_statistics")
    .select("id")
    .limit(1)
    .single();

  if (fetchError || !firstRow) {
    return new NextResponse(
      JSON.stringify({ success: false, error: "لم يتم العثور على صف لتحديثه" }),
      { status: 404, headers: res.headers }
    );
  }

  const payload: Record<string, number | string> = {};

  const num = (v: any) =>
    v === "" || v === null || v === undefined ? undefined : Number(v);

  const maybe = (k: string, v: any) => {
    if (v !== undefined && !Number.isNaN(v)) payload[k] = v;
  };

  maybe("residential_area_sqm", num(body.residential_area_sqm ?? body.housing_area_sqm));
  maybe("housing_units",        num(body.housing_units));
  maybe("total_sales",          num(body.total_sales));
  maybe("total_acquisitions",   num(body.total_acquisitions));
  payload.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from("investor_statistics")
    .update(payload)
    .eq("id", firstRow.id);

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
