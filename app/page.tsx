import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import HomeStats from "@/components/home-stats";              // ✅ إحصائيات حقيقية من Supabase
import FeaturedProjects from "@/components/featured-projects"; // ✅ مشاريع مميزة حقيقية
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main id="main-content">
        {/* البطل */}
        <Hero />

        {/* ✅ إحصائيات حقيقية (سنوات الخبرة، الجوائز، العملاء، المشاريع المكتملة) */}
        <HomeStats />

        {/* ✅ مشاريعنا المميزة من Supabase */}
        <FeaturedProjects />

        {/* زر عرض جميع المشاريع (يحافظ على نفس مكانه السابق) */}
        <section className="py-6">
          <div className="container mx-auto px-4 text-center">
            <Button
              asChild
              size="lg"
              className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-180 hover:scale-105 hover:rotate-2"
            >
              <Link href="/projects">عرض جميع المشاريع</Link>
            </Button>
          </div>
        </section>

        {/* CSR Teaser */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="rounded-3xl bg-card text-card-foreground p-8 md:p-12 lg:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">ملتزمون برؤية المملكة 2030</h2>
              <p className="text-lg text-card-foreground/80 max-w-3xl mx-auto mb-8 leading-relaxed text-pretty">
                نساهم في تحقيق رؤية المملكة من خلال مشاريع مستدامة ومبادرات مجتمعية تدعم التنمية الشاملة
              </p>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-2xl border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-180 hover:scale-105 bg-transparent"
              >
                <Link href="/csr/vision2030">اعرف المزيد عن مبادراتنا</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Investor CTA */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">فرص استثمارية واعدة</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
                انضم إلى شركائنا المستثمرين واستفد من فرص النمو في قطاع التطوير العقاري
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-180 hover:scale-105 hover:rotate-2"
              >
                <Link href="/investors">معلومات المستثمرين</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
