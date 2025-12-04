import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { partners } from "@/data/partners";

export const metadata = {
  title: "المستثمرون | مؤسسة محمد سليمان اليحيا للتطوير العقاري",
  description: "معلومات للمستثمرين والشركاء الاستراتيجيين",
};

// 🧩 Supabase Server Client
function supa() {
  const cookieStore = cookies();
  return createServerClient(
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
}

export default async function InvestorsPage() {
  const supabase = supa();

  // 🟢 جلب إحصائيات المستثمرين من قاعدة البيانات
  const { data: investorStats } = await supabase
    .from("investor_statistics")
    .select("residential_area_sqm, housing_units, total_sales, total_acquisitions")
    .limit(1)
    .single();

  // 🟢 جلب إحصائيات الموقع (years_experience, awards_count, clients_count)
  const { data: siteStats } = await supabase
    .from("site_statistics")
    .select("years_experience, awards_count, clients_count")
    .eq("id", 1)
    .maybeSingle();

  // 🟢 عدد المشاريع المكتملة
  const { count: completedCount } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("status", "completed")
    .eq("published", true);

  // 🧾 معالجة البيانات القادمة
  const inv = investorStats || {
    residential_area_sqm: 0,
    housing_units: 0,
    total_sales: 0,
    total_acquisitions: 0,
  };

  const site = {
    years: siteStats?.years_experience ?? 0,
    awards: siteStats?.awards_count ?? 0,
    clients: siteStats?.clients_count ?? 0,
    completed: completedCount ?? 0,
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main id="main-content">
        <PageHeader
          title="المستثمرون"
          subtitle="فرص استثمارية وشراكات استراتيجية في قطاع التطوير العقاري"
          image="/investors.avif" // ✅ الصورة الجديدة
        />

        <div className="container mx-auto px-4 py-12">
          <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "المستثمرون" }]} />

          {/* 📊 إحصائيات الشركة */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              إحصائيات الشركة
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                label="المساحة السكنية"
                value={`+${Number(inv.residential_area_sqm).toLocaleString()} م²`}
              />
              <StatCard
                label="عدد الوحدات السكنية"
                value={`+${Number(inv.housing_units).toLocaleString()}`}
              />
              <StatCard
                label="إجمالي المبيعات"
                value={`+${Number(inv.total_sales).toLocaleString()} ريال`}
              />
              <StatCard
                label="إجمالي الاستحواذات"
                value={`+${Number(inv.total_acquisitions).toLocaleString()} ريال`}
              />
            </div>
          </section>

          {/* 🌟 إحصائيات الموقع */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              إحصائيات الموقع
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="سنوات الخبرة" value={`+${site.years}`} />
              <StatCard label="جوائز وتكريم" value={`+${site.awards}`} />
              <StatCard label="عملاء راضون" value={`+${site.clients}`} />
              <StatCard label="المشاريع المكتملة" value={`+${site.completed}`} />
            </div>
          </section>

          <section className="mb-20">
  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
    شركاء النجاح
  </h2>

  <div className="slider">
    <div className="slide-track">
      {partners.concat(partners).map((partner, index) => (
        <div className="slide" key={index}>
          <img
            src={partner.logo}
            alt={partner.name}
            className="w-32 h-16 sm:w-40 sm:h-20 md:w-44 md:h-24 object-contain grayscale hover:grayscale-0 transition duration-300"
          />
        </div>
      ))}
    </div>
  </div>
</section>


          {/* ✉️ تواصل معنا */}
          <section className="max-w-3xl mx-auto text-center">
            <div className="bg-card text-card-foreground rounded-3xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">هل لديك استفسار؟</h2>
              <p className="text-lg text-card-foreground/80 mb-6">
                فريق علاقات المستثمرين لدينا جاهز للإجابة على جميع استفساراتكم
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="rounded-2xl bg-primary text-primary-foreground px-6 py-3 hover:bg-primary/90"
                >
                  تواصل معنا
                </a>
                <a
                  href="mailto:investors@alyahya.sa"
                  className="rounded-2xl border-2 border-accent text-accent px-6 py-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  investors@alyahya.sa
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ✅ بطاقة الإحصائيات
function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-card text-card-foreground rounded-2xl p-6 text-center transition-all duration-200 hover:scale-105 hover:shadow-lg">
      <div className="text-3xl md:text-4xl font-bold text-accent mb-2">{value}</div>
      <div className="text-lg font-medium text-card-foreground">{label}</div>
    </div>
  );
}
