// ✅ app/csr/community/page.tsx

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Breadcrumbs } from "@/components/breadcrumbs"
import Image from "next/image"
import { HeartHandshake, Leaf, Users } from "lucide-react"

export const metadata = {
  title: "خدمة المجتمع | مؤسسة اليحيا للتطوير العقاري",
  description: "رؤيتنا المستقبلية للمسؤولية الاجتماعية والمجتمعية",
}

// 🟢 مبادرات مستقبلية (بدل البرامج غير الموجودة)
const futureInitiatives = [
  {
    icon: HeartHandshake,
    title: "شراكات مجتمعية مستقبلية",
    description:
      "نهدف خلال السنوات القادمة إلى عقد شراكات فعّالة مع الجمعيات المحلية والمؤسسات التعليمية لخدمة المجتمع وتنمية البيئة المحيطة بمشاريعنا.",
  },
  {
    icon: Users,
    title: "دعم فئة الشباب",
    description:
      "نسعى لتطوير برامج تدريبية وتطوعية مستقبلية تتيح للشباب اكتساب خبرة ميدانية في مجالات التطوير العقاري والهندسي والإداري.",
  },
  {
    icon: Leaf,
    title: "مبادرات بيئية",
    description:
      "نخطط لإطلاق مبادرات خضراء تركز على التشجير، وإدارة النفايات، وتحسين كفاءة الطاقة في المشاريع المستقبلية للشركة.",
  },
]

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main id="main-content">
        <PageHeader
          title="خدمة المجتمع"
          subtitle="نضع بذور الخير اليوم لنصنع أثراً غداً"
          image="/community.jpg" // ✅ الصورة الحقيقية المضافة من مجلد public
        />

        <div className="container mx-auto px-4 py-12">
          {/* ✅ المسار */}
          <Breadcrumbs
            items={[
              { label: "الرئيسية", href: "/" },
              { label: "خدمة المجتمع" },
            ]}
          />

          {/* ✅ مقدمة */}
          <section className="max-w-4xl mx-auto mb-24 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">رؤيتنا لخدمة المجتمع</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              رغم حداثة تأسيس الشركة، نؤمن بأن مسؤوليتنا تجاه المجتمع جزء أساسي من هويتنا المستقبلية.
              نخطط لتأسيس مبادرات واقعية ومستدامة تخدم الإنسان والمكان، وتتماشى مع قيم رؤية المملكة 2030.
            </p>
          </section>

          {/* ✅ مبادرات مستقبلية */}
          <section className="mb-24">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {futureInitiatives.map((item, index) => (
                <div
                  key={index}
                  className="group bg-card text-card-foreground rounded-3xl p-8 border border-border
                  transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-accent/40 text-center"
                >
                  <div className="h-14 w-14 mx-auto mb-6 rounded-2xl bg-accent/10 flex items-center justify-center transition-all duration-300 group-hover:bg-accent/20">
                    <item.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-card-foreground/80 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ✅ فقرة تأكيد */}
          <section className="max-w-3xl mx-auto text-center mb-24">
            <div className="bg-muted/30 rounded-3xl p-8 md:p-12 border border-border hover:shadow-lg transition-all duration-300">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">الالتزام بالمستقبل</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                نحن في شركة اليحيا للتطوير العقاري نخطو بخطوات متأنية وواضحة نحو بناء منظومة مسؤولية اجتماعية
                حقيقية تبدأ من داخل الشركة وتمتد إلى المجتمع. نؤمن أن النجاح لا يُقاس فقط بالمشاريع المنجزة،
                بل بالأثر الذي نتركه في محيطنا.
              </p>
            </div>
          </section>

          {/* ✅ دعوة للتعاون */}
          <section className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">دعوة للشراكة المجتمعية</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              إذا كنت تمثل جمعية خيرية أو مبادرة مجتمعية وترغب في التعاون مستقبلاً، يسعدنا التواصل معك
              لتبادل الخبرات وبناء شراكات تحقق أثرًا حقيقيًا.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105 font-medium text-lg"
            >
              تواصل معنا
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
