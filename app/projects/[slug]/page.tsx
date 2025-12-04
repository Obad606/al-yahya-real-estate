// app/projects/[slug]/page.tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Ruler, Building2, Users, Download } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// أعِد التوليد كل 60 ثانية
export const revalidate = 60;

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  location: string | null;
  status: "ongoing" | "completed" | "planned";
  type: string | null;
  year: number | null;
  area_sqm: number | null;
  units: number | null;
  description: string | null;
  featured_image: string | null;
  pdf_file?: string | null;
  gallery_images?: string[] | null;
};

type GalleryRow = { id: string; url: string; alt: string | null; sort_order: number | null };
type TimelineRow = { id: string; label: string; date: string | null; sort_order: number | null };

const statusColors: Record<ProjectRow["status"], string> = {
  ongoing: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  completed: "bg-green-500/10 text-green-700 dark:text-green-300",
  planned: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

const statusLabels: Record<ProjectRow["status"], string> = {
  ongoing: "تحت الإنشاء",
  completed: "مكتمل",
  planned: "مخطط",
};

const fmtDate = (iso: string | null) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("ar-SA", { year: "numeric", month: "long", day: "2-digit" }).format(d);
};

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  // ✅ عميل Supabase للسيرفر
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value } }
  );

  // 1) ابحث بالـ slug
  let { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id,slug,title,location,status,type,year,area_sqm,units,description,featured_image,pdf_file,gallery_images")
    .eq("slug", params.slug)
    .eq("published", true)
    .maybeSingle<ProjectRow>();

  // 2) لو لم يُعثر عليه، جرّب التحويل من عنوان عربي إلى slug
  if (projectError || !project) {
    const decoded = decodeURIComponent(params.slug);
    const { data: byTitle } = await supabase
      .from("projects")
      .select("slug")
      .eq("title", decoded)
      .maybeSingle<{ slug: string }>();
    if (byTitle?.slug) {
      redirect(`/projects/${encodeURIComponent(byTitle.slug)}`);
    }
    notFound();
  }

  // 3) المعرض من جدول project_gallery
  const { data: gallery } = (await supabase
    .from("project_gallery")
    .select("id,url,alt,sort_order")
    .eq("project_id", project.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })) as { data: GalleryRow[] | null };

  // 3.1) Fallback إلى حقل المصفوفة داخل projects إن لم يوجد جدول
  const galleryFromProject =
    (project.gallery_images ?? []).map((url, idx) => ({
      id: `proj-${idx}`,
      url,
      alt: null as string | null,
      sort_order: idx,
    }));

  const galleryFinal = (gallery && gallery.length > 0) ? gallery : galleryFromProject;

  // 4) الجدول الزمني
  const { data: timeline } = (await supabase
    .from("project_timeline")
    .select("id,label,date,sort_order")
    .eq("project_id", project.id)
    .order("sort_order", { ascending: true })
    .order("date", { ascending: true })) as { data: TimelineRow[] | null };

  // صورة البطل
  const heroImage = galleryFinal?.[0]?.url || project.featured_image || "/placeholder.svg";

  const nf = new Intl.NumberFormat("ar-EG");
  const areaText = project.area_sqm ? `${nf.format(project.area_sqm)} متر مربع` : null;
  const unitsText = project.units ? `${nf.format(project.units)} وحدة` : null;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main id="main-content">
        {/* صورة الغلاف */}
        <div className="relative w-full h-[50vh] md:h-[60vh]">
          <Image
            src={heroImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <Breadcrumbs
            items={[
              { label: "الرئيسية", href: "/" },
              { label: "المشاريع", href: "/projects" },
              { label: project.title },
            ]}
          />

          <div className="grid lg:grid-cols-3 gap-12 mt-8">
            {/* المحتوى الرئيسي */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={statusColors[project.status]}>{statusLabels[project.status]}</Badge>
                  {project.type && <Badge variant="outline">{project.type}</Badge>}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">{project.title}</h1>
                {project.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5 text-accent" />
                    <span className="text-lg">{project.location}</span>
                  </div>
                )}
              </div>

              {project.description && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">نبذة عن المشروع</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">{project.description}</p>

                  {project.pdf_file && (
                    <a
                      href={project.pdf_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="تحميل ملف PDF الخاص بالمشروع"
                      className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
                    >
                      <Download className="h-4 w-4" />
                      تحميل ملف PDF
                    </a>
                  )}
                </div>
              )}

              {/* الجدول الزمني */}
              {timeline && timeline.length > 0 && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">الجدول الزمني</h2>
                  <div className="space-y-6">
                    {timeline.map((t, i) => (
                      <div key={t.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-3 w-3 rounded-full border-2 border-accent mt-1.5" />
                          {i < timeline.length - 1 && (
                            <div className="w-0.5 flex-1 mt-2 bg-border" style={{ minHeight: "40px" }} />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <h3 className="text-lg font-bold mb-1">{t.label}</h3>
                          <p className="text-muted-foreground">{fmtDate(t.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* المعرض */}
              {galleryFinal && galleryFinal.length > 0 && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">معرض الصور</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryFinal.map((g, idx) => (
                      <div key={g.id} className="relative aspect-square rounded-2xl overflow-hidden group">
                        <Image
                          src={g.url || "/placeholder.svg"}
                          alt={g.alt || `${project.title} - صورة ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* الشريط الجانبي */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {(project.year || areaText || project.type || unitsText) && (
                  <div className="bg-card rounded-2xl p-6 space-y-6">
                    <h3 className="text-xl font-bold">معلومات المشروع</h3>
                    <div className="space-y-4">
                      {project.year && (
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-accent mt-0.5" />
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">السنة</div>
                            <div className="font-medium">{project.year}</div>
                          </div>
                        </div>
                      )}
                      {areaText && (
                        <div className="flex items-start gap-3">
                          <Ruler className="h-5 w-5 text-accent mt-0.5" />
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">المساحة</div>
                            <div className="font-medium">{areaText}</div>
                          </div>
                        </div>
                      )}
                      {project.type && (
                        <div className="flex items-start gap-3">
                          <Building2 className="h-5 w-5 text-accent mt-0.5" />
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">النوع</div>
                            <div className="font-medium">{project.type}</div>
                          </div>
                        </div>
                      )}
                      {unitsText && (
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-accent mt-0.5" />
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">الوحدات</div>
                            <div className="font-medium">{unitsText}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-accent/10 rounded-2xl p-6 text-center">
                  <h3 className="text-xl font-bold mb-3">مهتم بهذا المشروع؟</h3>
                  <p className="text-muted-foreground mb-6">تواصل معنا للحصول على مزيد من المعلومات</p>
                  <Button asChild size="lg" className="w-full rounded-2xl bg-primary text-primary-foreground">
                    <Link href="/contact">تواصل معنا</Link>
                  </Button>
                </div>

                <Button asChild variant="outline" className="w-full rounded-2xl bg-transparent">
                  <Link href="/projects">عودة إلى المشاريع</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
