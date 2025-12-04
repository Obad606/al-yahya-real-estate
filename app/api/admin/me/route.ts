export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const res = NextResponse.json({}); // نحافظ عليه لتمرير أي تحديث للكوكيز (تجديد توكن مثلاً)

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
    return new NextResponse(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: res.headers,
    });
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("user_id, full_name, email, phone, role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile || !profile.is_active) {
    return new NextResponse(JSON.stringify({ authenticated: false }), {
      status: 403,
      headers: res.headers,
    });
  }

  return new NextResponse(
    JSON.stringify({
      authenticated: true,
      user: { id: user.id, email: user.email },
      admin: profile,
    }),
    { status: 200, headers: res.headers }
  );
}
