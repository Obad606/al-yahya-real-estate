import Image from "next/image"
import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title: string
  subtitle?: string
  image?: string
  className?: string
}

export function PageHeader({ title, subtitle, image, className }: PageHeaderProps) {
  return (
    <div className={cn("relative w-full h-[40vh] md:h-[50vh] overflow-hidden", className)}>
      {image && (
        <>
          {/* ✅ الصورة نفسها يمكن تظل تلتقط الأحداث */}
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover pointer-events-none" // 🔹 لا تلتقط نقرات
            priority
          />

          {/* ✅ الغطاء اللوني لا يتلقى أي نقرات */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40 pointer-events-none" />
        </>
      )}

      {/* ✅ هذه الطبقة فقط تتفاعل مع المستخدم */}
      <div className="relative h-full container mx-auto px-4 flex items-end pb-12 md:pb-16 pointer-events-auto">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">{title}</h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed text-pretty">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}
