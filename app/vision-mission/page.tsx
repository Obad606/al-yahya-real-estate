import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Eye, Target } from "lucide-react"

export const metadata = {
  title: "الرؤية والرسالة | مؤسسة اليحيا للتطوير العقاري",
  description: "رؤيتنا ورسالتنا في التطوير العقاري",
}

export default function VisionMissionPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main id="main-content">
        <PageHeader
          title="الرؤية والرسالة"
          subtitle="نحو مستقبل عقاري مستدام ومبتكر"
          image="/vision.avif"
        />

        <div className="container mx-auto px-4 py-12">
          <Breadcrumbs
            items={[
              { label: "الرئيسية", href: "/" },
              { label: "من نحن", href: "/about" },
              { label: "الرؤية والرسالة" },
            ]}
          />

          <div className="max-w-5xl mx-auto space-y-16">
            {/* Vision */}
            <section className="bg-card text-card-foreground rounded-3xl p-8 md:p-12">
              <div className="flex items-start gap-6 mb-6">
                <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Eye className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">رؤيتنا</h2>
                  <p className="text-xl md:text-2xl text-card-foreground/90 leading-relaxed text-balance">
                    أن نكون الشركة الرائدة في التطوير العقاري بالمملكة العربية السعودية، ونموذجاً يحتذى به في الابتكار
                    والاستدامة والجودة
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-lg text-card-foreground/80 leading-relaxed mt-8">
                <p>
                  نطمح إلى أن نكون الخيار الأول للعملاء والمستثمرين الباحثين عن مشاريع عقارية متميزة تجمع بين التصميم
                  العصري والجودة العالية والقيمة المستدامة.
                </p>
                <p>
                  نسعى لتحقيق هذه الرؤية من خلال الاستثمار المستمر في الكفاءات البشرية، وتبني أحدث التقنيات، والشراكة مع
                  أفضل المطورين والمقاولين محلياً وعالمياً.
                </p>
              </div>
            </section>

            {/* Mission */}
            <section className="bg-card text-card-foreground rounded-3xl p-8 md:p-12">
              <div className="flex items-start gap-6 mb-6">
                <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Target className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">رسالتنا</h2>
                  <p className="text-xl md:text-2xl text-card-foreground/90 leading-relaxed text-balance">
                    تطوير مشاريع عقارية استثنائية تلبي احتياجات عملائنا وتساهم في التنمية المستدامة للمملكة
                  </p>
                </div>
              </div>

              <div className="space-y-6 mt-8">
                <div>
                  <h3 className="text-xl font-bold text-card-foreground mb-3">نلتزم بـ:</h3>
                  <ul className="space-y-3 text-lg text-card-foreground/80">
                    <li className="flex items-start gap-3">
                      <span className="h-2 w-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span>تقديم مشاريع عقارية تتميز بأعلى معايير الجودة والابتكار</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="h-2 w-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span>بناء علاقات طويلة الأمد مع عملائنا قائمة على الثقة والشفافية</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="h-2 w-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span>المساهمة في تحقيق رؤية المملكة 2030 من خلال مشاريع مستدامة</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="h-2 w-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span>خلق قيمة مضافة لمستثمرينا وشركائنا</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="h-2 w-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span>تطوير كفاءات فريق العمل وتوفير بيئة عمل محفزة</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
