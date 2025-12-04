// ✅ app/governance/page.tsx

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Shield, FileText, Users, Scale } from "lucide-react"

const COMPANY_NAME = "مؤسسة محمد سليمان اليحيا للتطوير العقاري"

export const metadata = {
  title: `الحوكمة | ${COMPANY_NAME}`,
  description: `معايير الحوكمة والامتثال في ${COMPANY_NAME}`,
}

const governanceAreas = [
  {
    icon: Shield,
    title: "الشفافية والإفصاح",
    description:
      "تلتزم المؤسسة بمبدأ الشفافية في كل جوانب العمل الإداري والمالي، وتحرص على تقديم معلومات دقيقة وواضحة لأصحاب المصلحة.",
  },
  {
    icon: Users,
    title: "الإدارة الشفافة",
    description:
      "تدار المؤسسة بأسلوب إداري واضح ومباشر، مع تحديد المسؤوليات والاختصاصات لضمان الفاعلية والانضباط في القرارات.",
  },
  {
    icon: Scale,
    title: "الامتثال والالتزام",
    description:
      "تحرص المؤسسة على الالتزام بالقوانين والأنظمة المحلية، وتطبيق ممارسات الحوكمة بما يتناسب مع حجمها كشركة ناشئة في طور النمو.",
  },
  {
    icon: FileText,
    title: "إدارة المخاطر",
    description:
      "تتّبع المؤسسة نهجًا حذرًا في إدارة المشاريع والتوسّع، لضمان نمو مستقر ومستدام وتقليل المخاطر التشغيلية والمالية.",
  },
]

export default function GovernancePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main id="main-content">
        <PageHeader
          title="الحوكمة"
          subtitle="نلتزم بالوضوح والانضباط في كل خطوة"
          image="/governance.png" // ✅ الصورة الجديدة من مجلد public
        />

        <div className="container mx-auto px-4 py-12">
          <Breadcrumbs
            items={[
              { label: "الرئيسية", href: "/" },
              { label: "من نحن", href: "/about" },
              { label: "الحوكمة" },
            ]}
          />

          <div className="max-w-5xl mx-auto">
            {/* مقدمة */}
            <div className="text-center mb-16">
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                تقوم {COMPANY_NAME} على مبادئ الحوكمة الرشيدة من اليوم الأول لتأسيسها.
                ورغم كونها مؤسسة ناشئة، فإنها تضع أسسًا واضحة للالتزام والشفافية والمسؤولية لضمان نمو مستدام ومنضبط.
              </p>
            </div>

            {/* مجالات الحوكمة */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {governanceAreas.map((area, index) => (
                <div
                  key={index}
                  className="group bg-card text-card-foreground rounded-2xl p-8 border border-border
                             transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-accent/50"
                >
                  <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-accent/20">
                    <area.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{area.title}</h3>
                  <p className="text-card-foreground/80 leading-relaxed">{area.description}</p>
                </div>
              ))}
            </div>

            {/* مبادئ الحوكمة */}
            <div className="bg-muted/30 rounded-3xl p-8 md:p-12 border border-border">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">مبادئ الحوكمة الأساسية</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3">1. المساءلة</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    تحدد المؤسسة بوضوح المسؤوليات والصلاحيات لضمان محاسبة الجميع على الأداء والنتائج.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">2. العدالة</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    التعامل العادل مع جميع الأطراف من عملاء وشركاء وموظفين، مع احترام الحقوق والمصالح المتبادلة.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">3. الاستقلالية</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    تبني القرارات الإدارية والمالية بعيدًا عن تضارب المصالح لضمان نزاهة الإجراءات.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">4. المسؤولية الاجتماعية</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    مراعاة البعد الاجتماعي في كل خطوة، والسعي لأن يكون كل مشروع ذا أثر إيجابي على المجتمع والبيئة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
