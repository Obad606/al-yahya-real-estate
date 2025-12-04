"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Badge } from "./ui/badge"
import { MapPin, Calendar, Hammer, CheckCircle, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

type Status = "ongoing" | "completed" | "planned"

export type ProjectCardProps = {
  slug: string
  title: string
  image?: string | null
  status?: Status
  location?: string | null
  type?: string | null
  year?: number | null
  subtitle?: string | null
  summary?: string | null
}

// 🎨 يمكنك تعديل ألوان الحالات بحرية هنا:
const STATUS_STYLES: Record<
  Status,
  { label: string; color: string; icon: React.ElementType }
> = {
  ongoing: {
    label: "تحت الإنشاء",
    color: "bg-blue-600 text-white hover:bg-blue-700",
    icon: Hammer,
  },
  completed: {
    label: "مكتمل",
    color: "bg-green-600 text-white hover:bg-green-700",
    icon: CheckCircle,
  },
  planned: {
    label: "مخطط",
    color: "bg-amber-600 text-white hover:bg-amber-700",
    icon: CalendarDays,
  },
}

function ProjectCard({
  slug,
  title,
  image,
  status,
  location,
  type,
  year,
  subtitle,
  summary,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const statusInfo = status ? STATUS_STYLES[status] : null

  return (
    <Link href={`/projects/${encodeURIComponent(slug)}`} className="block min-w-0">
      <Card
        className={cn(
          "group overflow-hidden rounded-2xl transition-all duration-200 min-w-0",
          "hover:shadow-xl md:hover:scale-[1.02] md:hover:-translate-y-1",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          "border-2 border-transparent hover:border-accent/25"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ✅ الصورة */}
        <CardHeader className="p-0">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              priority={false}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
              className={cn(
                "object-cover transition-transform duration-300 will-change-transform",
                "md:group-hover:scale-110"
              )}
            />
          </div>
        </CardHeader>

        {/* ✅ المحتوى */}
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 text-balance">
            {title}
          </h3>

          {(subtitle || summary) && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {subtitle || summary}
            </p>
          )}

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            {location ? (
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="line-clamp-1 break-words">{location}</span>
              </div>
            ) : null}

            {typeof year === "number" ? (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-accent flex-shrink-0" />
                <span>{year}</span>
              </div>
            ) : null}
          </div>
        </CardContent>

        {/* ✅ البادجات في الأسفل (سكني + الحالة بجانبه) */}
        {(type || statusInfo) && (
          <CardFooter className="px-6 pb-6 pt-0 flex items-center gap-2 flex-wrap">
            {type ? (
              <Badge
                variant="outline"
                className="rounded-full max-w-full truncate text-sm font-medium"
              >
                {type}
              </Badge>
            ) : null}

            {statusInfo ? (
              <Badge
                className={cn(
                  "rounded-full max-w-full truncate text-sm font-medium flex items-center gap-1 transition-colors",
                  statusInfo.color
                )}
              >
                <statusInfo.icon className="h-4 w-4" />
                {statusInfo.label}
              </Badge>
            ) : null}
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}

export default ProjectCard
export { ProjectCard }
