"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useLanguage } from "./language-provider"
import { cn } from "@/lib/utils"

type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { direction } = useLanguage() // الآن دائمًا rtl
  const ChevronIcon = direction === "rtl" ? ChevronRight : ChevronRight

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center gap-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronIcon className={cn("h-4 w-4 text-muted-foreground", direction === "rtl" && "rotate-180")} />
            )}
            {item.href ? (
              <Link href={item.href} className="text-muted-foreground hover:text-accent transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
