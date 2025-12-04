// components/home-stats.tsx
// Server Component: يجلب إحصائيات الموقع + إحصائيات الشركة من Supabase

import { makeServerClient } from "@/lib/supabase-server"

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="rounded-2xl bg-card text-card-foreground border border-border p-8 text-center">
      <div className="mb-3 flex items-center justify-center">{icon}</div>
      <div className="text-4xl font-extrabold">{value}</div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

export default async function HomeStats() {
  const supabase = makeServerClient()

  // 🟢 جلب إحصائيات الموقع
  const { data: siteStats } = await supabase
    .from("site_statistics")
    .select("years_experience, awards_count, clients_count")
    .eq("id", 1)
    .maybeSingle()

  // 🟢 عدد المشاريع المكتملة
  const { count: completedCount } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("status", "completed")
    .eq("published", true)

  // 🟢 جلب إحصائيات الشركة
  const { data: investorStats } = await supabase
    .from("investor_statistics")
    .select("residential_area_sqm, housing_units, total_sales, total_acquisitions")
    .limit(1)
    .single()

  // معالجة البيانات
  const site = {
    years: siteStats?.years_experience ?? 0,
    awards: siteStats?.awards_count ?? 0,
    clients: siteStats?.clients_count ?? 0,
    completed: completedCount ?? 0,
  }

  const inv = {
    residential_area_sqm: investorStats?.residential_area_sqm ?? 0,
    housing_units: investorStats?.housing_units ?? 0,
    total_sales: investorStats?.total_sales ?? 0,
    total_acquisitions: investorStats?.total_acquisitions ?? 0,
  }

  return (
    <section className="container mx-auto px-4 py-16">
      {/* 🌟 إحصائيات الموقع */}
      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">إحصائيات الموقع</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<span className="text-accent text-3xl">↗️</span>} value={`+${site.years}`} label="سنة من الخبرة" />
          <StatCard icon={<span className="text-accent text-3xl">🏅</span>} value={`+${site.awards}`} label="جائزة وتكريم" />
          <StatCard icon={<span className="text-accent text-3xl">👥</span>} value={`+${site.clients}`} label="عميل راضٍ" />
          <StatCard icon={<span className="text-accent text-3xl">🏗️</span>} value={`+${site.completed}`} label="مشروع مكتمل" />
        </div>
      </div>

      {/* 🏢 إحصائيات الشركة */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">إحصائيات الشركة</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<span className="text-accent text-3xl">🏠</span>}
            value={`+${inv.residential_area_sqm.toLocaleString()} م²`}
            label="المساحة السكنية"
          />
          <StatCard
            icon={<span className="text-accent text-3xl">🏘️</span>}
            value={`+${inv.housing_units.toLocaleString()}`}
            label="عدد الوحدات السكنية"
          />
          <StatCard
            icon={<span className="text-accent text-3xl">💰</span>}
            value={`+${inv.total_sales.toLocaleString()} ريال`}
            label="إجمالي المبيعات"
          />
          <StatCard
            icon={<span className="text-accent text-3xl">📈</span>}
            value={`+${inv.total_acquisitions.toLocaleString()} ريال`}
            label="إجمالي الاستحواذات"
          />
        </div>
      </div>
    </section>
  )
}
