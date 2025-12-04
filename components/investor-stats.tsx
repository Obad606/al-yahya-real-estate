// components/investor-stats.tsx
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export default async function InvestorStats() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        // في Server Components قد تكون الكوكيز للقراءة فقط، لذا نغلف setAll بـ try/catch
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

  const { data } = await supabase
    .from("investor_statistics")
    .select("residential_area_sqm, housing_units, total_sales, total_acquisitions")
    .limit(1)
    .single();

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon="🏠" value={data?.residential_area_sqm ?? 0} label="م² مساحة سكنية" />
        <Stat icon="🏘️" value={data?.housing_units ?? 0} label="وحدة سكنية" />
        <Stat icon="💰" value={data?.total_sales ?? 0} label="مبيعات (ريال)" />
        <Stat icon="📈" value={data?.total_acquisitions ?? 0} label="إجمالي الاستحواذات (ريال)" />
      </div>
    </section>
  );
}

function Stat({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-accent">+{value.toLocaleString()}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
