// app/projects/page.tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProjectsGrid } from "@/components/projects-grid";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// اجعل الصفحة تتحدّث كل 60 ثانية (اختياري)
export const revalidate = 60;

export const metadata = {
  title: "المشاريع | مؤسسة اليحيا للتطوير العقاري",
  description: "استكشف مشاريعنا العقارية المتميزة",
};

export default async function ProjectsPage() {
  // ✅ استخدم عميل السيرفر بدل lib/supabase
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value } }
  );

  const { data, error } = await supabase
    .from("projects")
    .select("slug,title,location,status,type,year,featured_image")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error.message);
  }

  const projects =
    (data ?? []).map((p) => ({
      slug: p.slug,
      title: p.title,
      location: p.location ?? "",
      status: (p.status ?? "planned") as "ongoing" | "completed" | "planned",
      image: p.featured_image || "/placeholder.svg",
      type: p.type ?? "",
      year: p.year ?? null, // ✅ رقم أو null (أفضل للتوافق مع ProjectCard)
    }));

  return (
    <div className="min-h-screen">
      <Navbar />

      <main id="main-content">
        <PageHeader
          title="مشاريعنا"
          subtitle="استكشف محفظتنا المتنوعة من المشاريع العقارية المتميزة"
            image="/Yahya_project.jpg"
        />

        <div className="container mx-auto px-4 py-12">
          <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "المشاريع" }]} />
          <ProjectsGrid projects={projects} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
