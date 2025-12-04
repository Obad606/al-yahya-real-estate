"use client"

import * as React from "react"
import { ProjectCard } from "./project-card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Search, X } from "lucide-react"
import { useLanguage } from "./language-provider"

type Project = {
  slug: string
  title: string
  location: string
  status: "ongoing" | "completed" | "planned"
  image: string
  type: string
  year?: number | string | null
}

type ProjectsGridProps = {
  projects: Project[]
}

const STATUS_LABELS = {
  ar: { ongoing: "تحت الإنشاء", completed: "مكتمل", planned: "مخطط" },
  en: { ongoing: "Ongoing", completed: "Completed", planned: "Planned" },
} as const

function normalizeYear(y: Project["year"]): number | null {
  if (typeof y === "number") return Number.isFinite(y) ? y : null
  if (typeof y === "string") {
    const n = Number(y.trim())
    return Number.isFinite(n) ? n : null
  }
  return null
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const { language } = useLanguage()

  // 🔎 بحث
  const [searchQuery, setSearchQuery] = React.useState("")

  // ✅ فلاتر بسيطة بـ <select> بدون Portals
  const [statusFilter, setStatusFilter] = React.useState<string>("")
  const [typeFilter, setTypeFilter] = React.useState<string>("")
  const [locationFilter, setLocationFilter] = React.useState<string>("")

  // خيارات الفلاتر (unique + مرتبة)
  const { statuses, types, locations } = React.useMemo(() => {
    const st = Array.from(new Set(projects.map((p) => p.status))).sort()
    const ty = Array.from(new Set(projects.map((p) => p.type).filter(Boolean))).sort()
    const loc = Array.from(new Set(projects.map((p) => p.location).filter(Boolean))).sort()
    return { statuses: st, types: ty, locations: loc }
  }, [projects])

  const t = STATUS_LABELS[language as keyof typeof STATUS_LABELS] ?? STATUS_LABELS.ar

  // فلترة
  const filteredProjects = React.useMemo(() => {
    const q = searchQuery.trim().toLocaleLowerCase("ar")
    return projects.filter((p) => {
      const matchSearch =
        q.length === 0 ||
        (p.title ?? "").toLocaleLowerCase("ar").includes(q) ||
        (p.location ?? "").toLocaleLowerCase("ar").includes(q)

      const matchStatus = !statusFilter || p.status === statusFilter
      const matchType = !typeFilter || p.type === typeFilter
      const matchLocation = !locationFilter || p.location === locationFilter

      return matchSearch && matchStatus && matchType && matchLocation
    })
  }, [projects, searchQuery, statusFilter, typeFilter, locationFilter])

  const hasActiveFilters =
    searchQuery.length > 0 || !!statusFilter || !!typeFilter || !!locationFilter

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("")
    setTypeFilter("")
    setLocationFilter("")
  }

  return (
    <div className="min-w-0">
      {/* شريط البحث */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder={language === "ar" ? "ابحث عن مشروع..." : "Search projects..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-12 rounded-2xl h-12 text-base"
            aria-label={language === "ar" ? "بحث عن المشاريع" : "Search projects"}
          />
        </div>
      </div>

      {/* الفلاتر: الحالة / النوع / الموقع — عناصر select أصلية لتفادي مشاكل النقر */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* الحالة */}
        <label className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">
            {language === "ar" ? "الحالة" : "Status"}
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-2xl border bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">{language === "ar" ? "الكل" : "All"}</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {t[s as keyof typeof t]}
              </option>
            ))}
          </select>
        </label>

        {/* النوع */}
        <label className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">
            {language === "ar" ? "النوع" : "Type"}
          </span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-11 rounded-2xl border bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">{language === "ar" ? "الكل" : "All"}</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        {/* الموقع */}
        <label className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">
            {language === "ar" ? "الموقع" : "Location"}
          </span>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="h-11 rounded-2xl border bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">{language === "ar" ? "الكل" : "All"}</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* شارات الفلاتر + مسح */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {statusFilter && (
            <Badge variant="secondary" className="rounded-full gap-1 pr-1">
              {t[statusFilter as keyof typeof t]}
              <button
                onClick={() => setStatusFilter("")}
                className="h-4 w-4 rounded-full hover:bg-muted flex items-center justify-center"
                aria-label={language === "ar" ? "إزالة فلتر الحالة" : "Clear status filter"}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {typeFilter && (
            <Badge variant="secondary" className="rounded-full gap-1 pr-1">
              {typeFilter}
              <button
                onClick={() => setTypeFilter("")}
                className="h-4 w-4 rounded-full hover:bg-muted flex items-center justify-center"
                aria-label={language === "ar" ? "إزالة فلتر النوع" : "Clear type filter"}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {locationFilter && (
            <Badge variant="secondary" className="rounded-full gap-1 pr-1">
              {locationFilter}
              <button
                onClick={() => setLocationFilter("")}
                className="h-4 w-4 rounded-full hover:bg-muted flex items-center justify-center"
                aria-label={language === "ar" ? "إزالة فلتر الموقع" : "Clear location filter"}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          <Button
            variant="ghost"
            onClick={clearFilters}
            className="rounded-2xl gap-2 text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4" />
            {language === "ar" ? "مسح الفلاتر" : "Clear Filters"}
          </Button>
        </div>
      )}

      {/* عدد النتائج */}
      <div className="mb-6 text-muted-foreground">
        {language === "ar"
          ? `عرض ${filteredProjects.length} من ${projects.length} مشروع`
          : `Showing ${filteredProjects.length} of ${projects.length} projects`}
      </div>

      {/* الشبكة */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              {...project}
              year={normalizeYear(project.year)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground mb-4">
            {language === "ar" ? "لم يتم العثور على مشاريع" : "No projects found"}
          </p>
          <Button onClick={clearFilters} variant="outline" className="rounded-2xl bg-transparent">
            {language === "ar" ? "مسح الفلاتر" : "Clear Filters"}
          </Button>
        </div>
      )}
    </div>
  )
}
