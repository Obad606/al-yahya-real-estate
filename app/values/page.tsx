import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Award, Users, Shield, Lightbulb, Heart, TrendingUp } from "lucide-react"

export const metadata = {
  title: "قيمنا | مؤسسة اليحيا للتطوير العقاري",
  description: "القيم الأساسية التي توجه عملنا",
}

const values = [
  {
    icon: Award,
    title: "التميز",
    description: "نسعى دائماً لتحقيق أعلى معايير الجودة في كل ما نقوم به، من التصميم إلى التنفيذ والتسليم.",
  },
  {
    icon: Shield,
    title: "النزاهة",
    description: "نلتزم بأعلى معايير الأخلاق والشفافية في جميع تعاملاتنا مع عملائنا وشركائنا.",
  },
  {
    icon: Lightbulb,
    title: "الابتكار",
    description: "نتبنى أحدث التقنيات والحلول المبتكرة لتقديم مشاريع عقارية عصرية ومستدامة.",
  },
  {
    icon: Users,
    title: "التعاون",
    description: "نؤمن بقوة العمل الجماعي والشراكات الاستراتيجية لتحقيق أهدافنا المشتركة.",
  },
  {
    icon: Heart,
    title: "المسؤولية الاجتماعية",
    description: "نساهم بفعالية في خدمة المجتمع ودعم التنمية المستدامة للمملكة.",
  },
  {
    icon: TrendingUp,
    title: "التطوير المستمر",
    description: "نستثمر في تطوير كفاءات فريقنا ونحرص على التحسين المستمر لعملياتنا.",
  },
]

export default function ValuesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main id="main-content">
        <PageHeader
          title="قيمنا الأساسية"
          subtitle="المبادئ التي توجه عملنا وتحدد هويتنا"
          image="/value.avif"
        />

        <div className="container mx-auto px-4 py-12">
          <Breadcrumbs
            items={[{ label: "الرئيسية", href: "/" }, { label: "من نحن", href: "/about" }, { label: "قيمنا" }]}
          />

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                قيمنا ليست مجرد كلمات، بل هي الأساس الذي نبني عليه علاقاتنا مع عملائنا وشركائنا، والمعايير التي نقيس بها
                نجاحنا
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="group p-8 rounded-2xl bg-card text-card-foreground transition-all duration-200 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                    <value.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-card-foreground">{value.title}</h3>
                  <p className="text-card-foreground/80 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 bg-muted/30 rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">نعيش قيمنا كل يوم</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                هذه القيم تنعكس في كل قرار نتخذه، وكل مشروع ننفذه، وكل علاقة نبنيها. نحن ملتزمون بأن نكون قدوة في قطاع
                التطوير العقاري
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
