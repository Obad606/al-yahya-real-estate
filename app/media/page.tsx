"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Breadcrumbs } from "@/components/breadcrumbs"
import Image from "next/image"
import { Calendar, FileText, X } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Media = {
  id: string
  type: string
  title: string
  excerpt: string | null
  description: string | null
  date: string | null
  image_url: string | null
  video_url: string | null
  pdf_url: string | null
}

const typeLabels = {
  news: "خبر",
  event: "فعالية",
  press: "بيان صحفي",
}

const typeColors = {
  news: "bg-blue-500/10 text-blue-700",
  event: "bg-green-500/10 text-green-700",
  press: "bg-purple-500/10 text-purple-700",
}

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Media | null>(null)

  useEffect(() => {
    async function fetchMedia() {
      setLoading(true)
      const { data, error } = await supabase
        .from("media")
        .select("*")
        .order("created_at", { ascending: false })
      if (!error && data) setMediaItems(data)
      setLoading(false)
    }
    fetchMedia()
  }, [])

  const closeModal = useCallback(() => setSelected(null), [])

  // إغلاق عند الضغط على ESC + تعطيل تمرير الصفحة عند فتح النموذج
  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeModal()
    window.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [selected, closeModal])

  return (
    <div className="min-h-screen">
      <Navbar />

      <main id="main-content">
        <PageHeader
          title="الإعلام"
          subtitle="آخر الأخبار والفعاليات والمواد الإعلامية"
          image="/media.jpg"
        />

        <div className="container mx-auto px-4 py-12">
          <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "الإعلام" }]} />

          {/* الشبكة */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                آخر الأخبار والفعاليات
              </h2>
              <p className="text-lg text-muted-foreground">
                تابع آخر أخبارنا وفعالياتنا وإنجازاتنا
              </p>
            </div>

            {loading ? (
              <p className="text-center text-muted-foreground">جاري التحميل...</p>
            ) : mediaItems.length === 0 ? (
              <p className="text-center text-muted-foreground">لا توجد بيانات حالياً</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mediaItems.map((item) => (
                  <article
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className="group bg-card text-card-foreground rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
                  >
                    {/* الصورة */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>

                    {/* المحتوى النصي */}
                    <div className="p-6">
                      {/* التاريخ والبادج */}
                      <div className="flex items-center justify-between mb-3 flex-wrap">
                        {/* التاريخ */}
                        <div className="flex items-center gap-1 text-sm text-card-foreground/60">
                          <Calendar className="h-4 w-4" />
                          <time dateTime={item.date || ""}>
                            {item.date
                              ? new Date(item.date).toLocaleDateString("ar-SA", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "بدون تاريخ"}
                          </time>
                        </div>

                        {/* بادج النوع */}
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            (typeColors as any)[item.type] || "bg-muted text-foreground"
                          }`}
                        >
                          {(typeLabels as any)[item.type] || "وسائط"}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-card-foreground mb-3 line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-card-foreground/70 line-clamp-3 leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* تواصل إعلامي */}
          <section className="mt-24 max-w-4xl mx-auto">
            <div className="bg-card text-card-foreground rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">للاستفسارات الإعلامية</h2>
              <p className="text-lg text-card-foreground/80 mb-6">
                للحصول على معلومات إضافية أو ترتيب مقابلات صحفية، يرجى التواصل مع قسم الإعلام
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:media@alyahya.sa"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-150 hover:scale-105"
                >
                  media@alyahya.sa
                </a>
                <a
                  href="tel:+966XXXXXXXX"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-2xl border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-150"
                >
                  +966 XX XXX XXXX
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* النافذة المنبثقة */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
          aria-modal="true"
          role="dialog"
          aria-labelledby="media-dialog-title"
        >
          <div
            className="bg-card rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 left-3 p-2 rounded-full bg-muted hover:bg-muted/70 transition"
              aria-label="إغلاق"
            >
              <X className="h-5 w-5" />
            </button>

            {selected.image_url && (
              <div className="relative aspect-[16/9]">
                <Image
                  src={selected.image_url}
                  alt={selected.title}
                  fill
                  className="object-contain rounded-t-3xl bg-black"
                />
              </div>
            )}

            <div className="p-6 md:p-10 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {selected.date &&
                  new Date(selected.date).toLocaleDateString("ar-SA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </div>

              <h2 id="media-dialog-title" className="text-2xl md:text-3xl font-bold">
                {selected.title}
              </h2>

              {selected.description ? (
                <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                  {selected.description}
                </p>
              ) : (
                <p className="text-muted-foreground">لا يوجد وصف إضافي</p>
              )}

              {selected.video_url && (
                <video controls className="w-full rounded-xl mt-4 border border-border">
                  <source src={selected.video_url} type="video/mp4" />
                  متصفحك لا يدعم عرض الفيديو
                </video>
              )}

              {selected.pdf_url && (
                <div className="pt-6">
                  <Button
                    asChild
                    className="rounded-2xl gap-2 bg-accent text-accent-foreground hover:bg-accent/80"
                  >
                    <a href={selected.pdf_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-5 w-5" />
                      تحميل الملف
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
