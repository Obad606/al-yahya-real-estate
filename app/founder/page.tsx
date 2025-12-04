// ✅ app/founder/page.tsx

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Quote, GraduationCap, Target, Lightbulb, Handshake } from "lucide-react"

const COMPANY_NAME = "مؤسسة محمد سليمان اليحيا للتطوير العقاري"
const FOUNDER_NAME = "محمد سليمان اليحيا"

export const metadata = {
  title: `المؤسس | ${COMPANY_NAME}`,
  description: `تعرف على مؤسس ${COMPANY_NAME}`,
}

export default function FounderPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main id="main-content">
        {/* ✅ إضافة صورة الرأس */}
        <PageHeader
          title="المؤسس"
          subtitle="القيادة والرؤية"
          image="/logo.png" // ✅ الصورة الجديدة
        />

        <div className="container mx-auto px-4 py-12">
          <Breadcrumbs
            items={[
              { label: "الرئيسية", href: "/" },
              { label: "من نحن", href: "/about" },
              { label: "المؤسس" },
            ]}
          />

          <div className="max-w-5xl mx-auto">
            {/* ملف المؤسس */}
            <div className="grid lg:grid-cols-5 gap-12 mb-16">
              {/* يمكن لاحقاً استبدال هذه المنطقة بصورة المؤسس الحقيقية */}
              <div className="lg:col-span-2">
                <div
                  className="flex aspect-[3/4] items-center justify-center rounded-3xl border border-dashed border-border bg-muted/20 text-muted-foreground"
                  aria-label="لا توجد صورة حالياً"
                >
                  لا توجد صورة حالياً — يمكن إضافتها لاحقًا
                </div>
              </div>

              <div className="lg:col-span-3 space-y-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">{FOUNDER_NAME}</h2>
                  <p className="text-xl text-accent">
                    المؤسس • في العشرينات • تخصّص تقنية معلومات (IT)
                  </p>
                </div>

                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    {FOUNDER_NAME} شاب سعودي في العشرينات، دارس تقنية معلومات (IT)، أسس{" "}
                    {COMPANY_NAME} عام 2022 برؤية عملية تقوم على النمو المتدرّج وبناء الثقة عبر
                    إنجازات قابلة للتحقق.
                  </p>
                  <p>
                    يركز على تطوير مشاريع سكنية وتجارية صغيرة إلى متوسطة، بمعايير جودة واضحة
                    وتسليم محكّم، مع تحسين الإجراءات والشراكات من مشروع لآخر.
                  </p>
                  <p>
                    يؤمن بأن الشفافية وإدارة المخاطر المحافظة هما الأساس لنجاح أي مؤسسة ناشئة في
                    قطاع التطوير العقاري.
                  </p>
                </div>

                {/* بطائق المعلومات */}
                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                  {[
                    {
                      icon: GraduationCap,
                      title: "خلفية تقنية",
                      text: "دراسة تقنية معلومات (IT) وتبني حلول عملية لرفع كفاءة التنفيذ.",
                    },
                    {
                      icon: Target,
                      title: "تركيز واضح",
                      text: "مشاريع صغيرة إلى متوسطة بنمو مدروس وخطوات قابلة للقياس.",
                    },
                    {
                      icon: Lightbulb,
                      title: "تفكير ابتكاري",
                      text: "حلول تصميم وتشغيل مبسطة وفعّالة بدل الوعود الكبيرة.",
                    },
                    {
                      icon: Handshake,
                      title: "شراكات موثوقة",
                      text: "التعاون مع موردين واستشاريين موثوقين لبناء سلسلة قيمة مستقرة.",
                    },
                  ].map((card, i) => (
                    <div
                      key={i}
                      className="group p-6 rounded-2xl bg-card text-card-foreground border border-border
                                 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-accent/50"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-accent/20">
                        <card.icon className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="text-lg font-bold mb-1">{card.title}</h3>
                      <p className="text-card-foreground/80">{card.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* اقتباس */}
            <div className="bg-card text-card-foreground rounded-3xl p-8 md:p-12 relative border border-border">
              <Quote className="h-16 w-16 text-accent/20 absolute top-8 right-8" />
              <div className="relative">
                <p className="text-2xl md:text-3xl font-medium leading-relaxed text-balance mb-6">
                  "نقيس النجاح بما ننجزه فعليًا وبأثره على الناس، لا بما نعد به."
                </p>
                <p className="text-lg text-card-foreground/80">— {FOUNDER_NAME}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
