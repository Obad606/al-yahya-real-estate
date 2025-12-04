import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET() {
  const res = NextResponse.json({});
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  const { data, error } = await supabase
    .from("investor_statistics")
    .select("residential_area_sqm, housing_units, total_sales, total_acquisitions")
    .limit(1)
    .single();

  if (error) {
    return new NextResponse(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: res.headers,
    });
  }

  return new NextResponse(JSON.stringify({
    success: true,
    residential_area_sqm: Number(data?.residential_area_sqm ?? 0),
    housing_units: Number(data?.housing_units ?? 0),
    total_sales: Number(data?.total_sales ?? 0),
    total_acquisitions: Number(data?.total_acquisitions ?? 0),
  }), { status: 200, headers: res.headers });
}
