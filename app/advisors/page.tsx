import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Breadcrumbs } from "@/components/breadcrumbs"
import Image from "next/image"
import { Linkedin } from "lucide-react"

export const metadata = {
  title: "المستشارون | مؤسسة اليحيا للتطوير العقاري",
  description: "تعرف على فريق المستشارين في شركة اليحيا",
}

const advisors = [
  {
    name: "د. محمد العتيبي",
    title: "مستشار استراتيجي",
    image: "/saudi-business-advisor-1.jpg",
    bio: "خبير في التخطيط الاستراتيجي والتطوير العقاري مع أكثر من 25 عاماً من الخبرة",
  },
  {
    name: "المهندسة سارة الدوسري",
    title: "مستشارة تصميم وعمارة",
    image: "/saudi-female-architect.jpg",
    bio: "معمارية حائزة على جوائز عالمية متخصصة في التصميم المستدام",
  },
  {
    name: "أ. خالد المطيري",
    title: "مستشار قانوني",
    image: "/saudi-legal-advisor.jpg",
    bio: "محامٍ متخصص في القانون العقاري والتجاري مع خبرة 20 عاماً",
  },
  {
    name: "د. فاطمة الشمري",
    title: "مستشارة استدامة",
    image: "/saudi-sustainability-expert.jpg",
    bio: "خبيرة في الاستدامة البيئية والمباني الخضراء معتمدة من LEED",
  },
]

export default function AdvisorsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main id="main-content">
        <PageHeader
          title="المستشارون"
          subtitle="فريق من الخبراء يدعم رؤيتنا ويوجه استراتيجيتنا"
          image="/business-advisory-board.jpg"
        />

        <div className="container mx-auto px-4 py-12">
          <Breadcrumbs
            items={[{ label: "الرئيسية", href: "/" }, { label: "من نحن", href: "/about" }, { label: "المستشارون" }]}
          />

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                نفخر بالعمل مع نخبة من المستشارين والخبراء في مختلف المجالات، الذين يساهمون في توجيه استراتيجيتنا وضمان
                تميز مشاريعنا
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {advisors.map((advisor, index) => (
                <div
                  key={index}
                  className="group bg-card text-card-foreground rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={advisor.image || "/placeholder.svg"}
                      alt={advisor.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-card-foreground mb-2">{advisor.name}</h3>
                    <p className="text-accent font-medium mb-4">{advisor.title}</p>
                    <p className="text-card-foreground/80 leading-relaxed mb-4">{advisor.bio}</p>
                    <button
                      className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-150 hover:scale-110"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
