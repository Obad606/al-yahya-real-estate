// ✅ app/about/page.tsx

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Target, Eye, Award, Rocket, Handshake, ShieldCheck } from "lucide-react"

const COMPANY_NAME = "مؤسسة محمد سليمان اليحيا للتطوير العقاري"

export const metadata = {
  title: `من نحن | ${COMPANY_NAME}`,
  description: `تعرف على ${COMPANY_NAME}، رؤيتنا، رسالتنا، وقيمنا`,
}

// 🟢 قيمنا الأساسية
const values = [
  {
    icon: Target,
    title: "التميّز",
    titleEn: "Excellence",
    description: "نسعى لتقديم قيمة حقيقية بمعايير جودة واضحة وخطوات تنفيذ دقيقة.",
  },
  {
    icon: Eye,
    title: "الشفافية",
    titleEn: "Transparency",
    description: "لغة أرقام واضحة وتحديثات صادقة مع العملاء والشركاء.",
  },
  {
    icon: Award,
    title: "الابتكار",
    titleEn: "Innovation",
    description: "نتبنّى حلولاً عملية وحديثة ترفع كفاءة التصميم والتنفيذ.",
  },
]

// 🟢 اتجاهاتنا القادمة
const roadmap = [
  {
    icon: Rocket,
    title: "نمو مسؤول",
    description:
      "التوسع بمشاريع صغيرة إلى متوسطة مع إدارة مخاطر محافظة وبناء سجل منجزات قابل للتحقق.",
  },
  {
    icon: Handshake,
    title: "شراكات نوعية",
    description:
      "بناء شراكات مع مقاولين ومكاتب استشارية وموردين موثوقين لتعزيز دورة التنفيذ والجودة.",
  },
  {
    icon: ShieldCheck,
    title: "جودة وموثوقية",
    description:
      "تحسين معايير الجودة والسلامة والتسليم، ورفع تجربة العملاء في كل مشروع جديد.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main id="main-content">
        <PageHeader
          title="من نحن"
          subtitle="مؤسسة ناشئة بخطوات ثابتة… نبني ثقة تُقاس بالمنجزات"
          image="/about.avif" // صورة من مجلد public
        />

        <div className="container mx-auto px-4 py-12">
          <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "من نحن" }]} />

          {/* نبذة واقعية */}
          <section className="mb-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                  من مؤسسة ناشئة إلى سجلّ منجزات متنامٍ
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    تأسست <span className="font-medium text-foreground">{COMPANY_NAME}</span> عام 2022. نعمل
                    على مشاريع سكنية وتجارية صغيرة إلى متوسطة مع تركيزٍ كبير على الجودة والتسليم المحكّم.
                  </p>
                  <p>
                    نفضّل الإعلان عن الأرقام المنجزة فقط، وبناء الثقة عبر نتائج قابلة للتحقق. ننمو تدريجيًا، ونطوّر
                    إجراءاتنا وشراكاتنا مع كل مشروع جديد.
                  </p>
                  <p>
                    رؤيتنا أن نكون مطوّرًا يعتمد عليه محليًا، بخيارات تصميم مدروسة، وتكلفة قابلة للقياس، وتجربة
                    عميل واضحة وشفافة.
                  </p>
                </div>
              </div>

              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg">
                <Image src="/meeting.jpg" alt={`اجتماع فريق ${COMPANY_NAME}`} fill className="object-cover" />
              </div>
            </div>
          </section>

          {/* قيمنا الأساسية (بطاقات تتحرك) */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">قيمنا الأساسية</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                ما يوجّه قراراتنا اليومية ويشكّل طريقة عملنا
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, i) => (
                <div
                  key={i}
                  className="group p-8 rounded-2xl bg-card text-card-foreground border border-border
                             transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-accent/50"
                >
                  <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-accent/20">
                    <value.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-card-foreground/80 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* اتجاهاتنا القادمة */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">اتجاهاتنا القادمة</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                لا نعرض برامج غير موجودة؛ بل نُظهر خططًا قابلة للتنفيذ عندما يحين وقتها
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {roadmap.map((item, i) => (
                <div
                  key={i}
                  className="group p-8 rounded-2xl bg-muted/30 border border-border text-card-foreground
                             transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-accent/40"
                >
                  <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-accent/20">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* روابط سريعة */}
          <section className="bg-muted/30 rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">اعرف المزيد عن المؤسسة</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                asChild
                variant="outline"
                className="rounded-2xl h-auto py-6 text-base bg-transparent
                           hover:bg-accent hover:text-accent-foreground hover:border-accent
                           transition-all duration-200 hover:scale-[1.02]"
              >
                <Link href="/vision-mission">الرؤية والرسالة</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-2xl h-auto py-6 text-base bg-transparent
                           hover:bg-accent hover:text-accent-foreground hover:border-accent
                           transition-all duration-200 hover:scale-[1.02]"
              >
                <Link href="/values">قيمنا</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-2xl h-auto py-6 text-base bg-transparent
                           hover:bg-accent hover:text-accent-foreground hover:border-accent
                           transition-all duration-200 hover:scale-[1.02]"
              >
                <Link href="/founder">المؤسس</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-2xl h-auto py-6 text-base bg-transparent
                           hover:bg-accent hover:text-accent-foreground hover:border-accent
                           transition-all duration-200 hover:scale-[1.02]"
              >
                <Link href="/governance">الحوكمة</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
