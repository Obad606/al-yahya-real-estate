// components/featured-projects.tsx
// Server Component: يجلب المشاريع المميزة من Supabase (حقيقية)
import { makeServerClient } from "@/lib/supabase-server"
import ProjectCard from "@/components/project-card"

export default async function FeaturedProjects() {
  const supabase = makeServerClient()

  // نجلب الحقول التي نحتاجها فقط
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, slug, title, subtitle, summary, featured_image, status, location, type, year, is_featured, published, created_at"
    )
    .eq("published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(8)

  if (error) {
    console.error("[featured-projects] supabase error:", error.message)
    return null
  }

  const projects = Array.isArray(data) ? data : []
  if (projects.length === 0) return null

  const normalizeYear = (y: unknown): number | null => {
    if (typeof y === "number" && Number.isFinite(y)) return y
    if (typeof y === "string") {
      const n = Number(y.trim())
      return Number.isFinite(n) ? n : null
    }
    return null
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">مشاريعنا المميزة</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            slug={p.slug}
            title={p.title}
            image={p.featured_image}
            status={p.status as "ongoing" | "completed" | "planned" | undefined}
            location={p.location}
            type={p.type}
            year={normalizeYear(p.year)}
            subtitle={p.subtitle}
            summary={p.summary}
          />
        ))}
      </div>
    </section>
  )
}
