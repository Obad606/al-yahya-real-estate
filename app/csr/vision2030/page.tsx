// ✅ app/csr/vision2030/page.tsx

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Breadcrumbs } from "@/components/breadcrumbs"
import Image from "next/image"
import { Target, Building2, Users, Leaf } from "lucide-react"

export const metadata = {
  title: "رؤية 2030 | مؤسسة اليحيا للتطوير العقاري",
  description: "مساهمتنا في تحقيق رؤية المملكة 2030",
}

// 🟢 مساهمات الشركة (نسخة واقعية لشركة ناشئة عمرها 3 سنوات)
const contributions = [
  {
    icon: Building2,
    title: "تنمية عمرانية على نطاقٍ متدرّج",
    description:
      "نركّز على مشاريع سكنية وتجارية صغيرة إلى متوسطة، مع تحسين البنية المجاورة وخدماتها بما يتوافق مع قدرات شركة ناشئة.",
  },
  {
    icon: Users,
    title: "تمكين الكفاءات المحلية",
    description:
      "نحرص على بناء بيئة عمل مهنية تتيح للفِرق اكتساب الخبرة الميدانية وتطوير مهاراتهم عبر المشاريع الفعلية.",
  },
  {
    icon: Leaf,
    title: "ممارسات استدامة عمليّة",
    description:
      "نطبّق حلول كفاءة الطاقة والعزل وإدارة المياه في حدود الجدوى، مع تبنّي تدريجي لمعايير البناء الأخضر.",
  },
  {
    icon: Target,
    title: "تحسين جودة الحياة تدريجيًا",
    description:
      "تصميمات تراعي الاحتياج الفعلي للسكان، ومساحات مشتركة وخدمات أساسية تُرفع تباعًا مع كل مشروع جديد.",
  },
]

// 🟢 مبادرات متوافقة مع رؤية 2030 (بدون ذكر التوطين)
const initiatives = [
  {
    title: "مساهمة في برنامج الإسكان",
    description: "تطوير وحدات ميسّرة على مراحل ضمن أحياء قائمة، بالتعاون مع مقاولين محليين.",
    impact: "أكثر من 100 وحدة منجزة + أكثر من 40 قيد التطوير",
  },
  {
    title: "تصميمات مستدامة",
    description: "تطبيق معايير كفاءة الطاقة (عزل، إضاءة عالية الكفاءة، تجهيزات مياه موفرة).",
    impact: "3 مشاريع بتصميم مستدام",
  },
  {
    title: "شراكات محلية",
    description: "نعمل على توسيع شراكاتنا مع الموردين والمقاولين المحليين لتعزيز دورة الاقتصاد المحلي.",
    impact: "10 شراكات فاعلة",
  },
]

export default function Vision2030Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main id="main-content">
        <PageHeader
          title="رؤية المملكة 2030"
          subtitle="نواكب رؤية المملكة بخطوات ثابتة ومسؤولية حقيقية"
          image="/csr.jpg" // ✅ تم استبدال الصورة هنا
        />

        <div className="container mx-auto px-4 py-12">
          {/* ✅ Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: "الرئيسية", href: "/" },
              { label: "رؤية 2030" },
            ]}
          />

          {/* ✅ المقدمة */}
          <section className="max-w-4xl mx-auto mb-24 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              دورنا في تحقيق الرؤية
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              نحن شركة ناشئة تأسست في 2022 ونموّنا تدرّجي. نُواءم استراتيجيتنا مع رؤية المملكة 2030 عبر
              مشاريع صغيرة إلى متوسطة الحجم، مع التركيز على الجودة والاستدامة وبناء سجلّ إنجازات شفّاف.
            </p>

            <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 shadow-lg">
              <Image src="/csr.jpg" alt="رؤية 2030" fill className="object-cover" /> {/* ✅ الصورة هنا أيضًا */}
            </div>
          </section>

          {/* ✅ المساهمات الرئيسية */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">مساهماتنا الرئيسية</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {contributions.map((contribution, index) => (
                <div
                  key={index}
                  className="group bg-card text-card-foreground rounded-2xl p-8 border border-border
                  transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-accent/50"
                >
                  <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-accent/20">
                    <contribution.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{contribution.title}</h3>
                  <p className="text-card-foreground/80 leading-relaxed">{contribution.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ✅ المبادرات */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">مبادراتنا المتوافقة مع الرؤية</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {initiatives.map((initiative, index) => (
                <div
                  key={index}
                  className="bg-muted/30 rounded-2xl p-6 text-center border border-border
                  transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-accent/40"
                >
                  <div className="text-4xl font-bold text-accent mb-3">{initiative.impact}</div>
                  <h3 className="text-xl font-bold mb-3">{initiative.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{initiative.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ✅ الالتزام المستمر */}
          <section className="max-w-4xl mx-auto mb-12">
            <div className="bg-card text-card-foreground rounded-3xl p-8 md:p-12 text-center border border-border shadow-md hover:shadow-xl transition-all duration-300">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">التزامنا بالنمو المسؤول</h2>
              <p className="text-lg text-card-foreground/80 leading-relaxed mb-8">
                بوصفنا شركة ناشئة منذ 2022، نُقدّم على مشاريعنا بخطوات محسوبة، ونُعلن أرقامنا المنجزة فقط.
                نطوّر قدراتنا عامًا بعد عام، ونوسّع شراكاتنا لنُسهم بواقعية في أهداف رؤية 2030.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="px-6 py-3 rounded-full bg-accent/10 text-accent font-medium">شفافية الإنجاز</div>
                <div className="px-6 py-3 rounded-full bg-accent/10 text-accent font-medium">نمو تدريجي</div>
                <div className="px-6 py-3 rounded-full bg-accent/10 text-accent font-medium">استدامة عملية</div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
