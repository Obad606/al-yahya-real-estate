// C:\Users\Dell\Downloads\code\app\admin\dashboard\page.tsx
// Server Component (بدون "use client")
import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/admin-session";
import dynamic from "next/dynamic";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";

// تحميل المكونات العميلية فقط وقت الحاجة
const StatsEditor = dynamic(() => import("@/components/admin/stats-editor"), { ssr: false });
const InvestorStatsEditor = dynamic(() => import("@/components/admin/investor-stats-editor"), { ssr: false });

export default async function DashboardPage() {
  const { user, profile } = await getAdminContext();

  if (!user || !profile || !profile.is_active) {
    redirect("/admin/login");
  }

  return (
    <AdminLayout>
      <main className="container mx-auto px-4 py-10 space-y-6">
        {/* العنوان */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">لوحة التحكم</h1>
          <p className="text-muted-foreground">
            مرحبًا {profile.full_name} — الدور:{" "}
            {profile.role === "super_admin" ? "مدير عام" : "مدير"}
          </p>
        </div>

        {/* البطاقات */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="المشاريع"
            desc="إدارة وإضافة المشاريع."
            href="/admin/manage-projects"
          />
          <DashboardCard
            title="الوسائط"
            desc="رفع الصور والفيديو."
            href="/admin/manage-media"
          />
          <DashboardCard
            title="رسائل التواصل"
            desc="عرض الرسائل الواردة."
            href="/admin/manage-contact"
          />
          {profile.role === "super_admin" && (
            <DashboardCard
              title="الإداريين"
              desc="إدارة الإداريين."
              href="/admin/manage-admins"
            />
          )}
        </div>

        {/* المحررات */}
        <StatsEditor />
        <InvestorStatsEditor />
      </main>
    </AdminLayout>
  );
}

function DashboardCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <div className="rounded-2xl border border-border p-6 bg-card transition hover:shadow-lg hover:scale-[1.02] duration-200">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
      <div className="mt-4">
        <a href={href}>
          <Button className="rounded-2xl">فتح</Button>
        </a>
      </div>
    </div>
  );
}
