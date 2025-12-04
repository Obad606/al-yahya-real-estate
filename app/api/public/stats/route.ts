import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// قراءة إحصائيات الموقع + حساب المشاريع المكتملة فعليًا
export async function GET() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value } }
  );

  // 1) الإحصائيات اليدوية القابلة للتعديل من الإدارة
  const { data: stats } = await supabase
    .from("site_statistics")
    .select("years_experience, awards_count, clients_count, updated_at")
    .eq("id", 1)
    .maybeSingle();

  // 2) عدد المشاريع المكتملة (حقيقي)
  const { count: completedCount } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("status", "completed")
    .eq("published", true);

  return NextResponse.json({
    years_experience: stats?.years_experience ?? 0,
    awards_count: stats?.awards_count ?? 0,
    clients_count: stats?.clients_count ?? 0,
    projects_completed: completedCount ?? 0,
    updated_at: stats?.updated_at ?? null,
  });
}
