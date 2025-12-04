// ✅ Server Component (بدون "use client")
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import { Phone, Mail, MapPin, Clock, ExternalLink, MessageCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "تواصل معنا | مؤسسة محمد سليمان اليحيا للتطوير العقاري",
  description: "تواصل مع فريقنا للاستفسارات والدعم",
};

// ✅ بيانات التواصل
const contactInfo = [
  {
    icon: Phone,
    title: "الهاتف",
    details: ["+966 53 791 6000"],
    dir: "ltr", // ✅ إضافة الاتجاه هنا فقط

  },
  
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    details: ["info@alyahya.sa", "support@alyahya.sa"],
  },
  {
    icon: MapPin,
    title: "العنوان",
    details: [
      "مكتب الحي الإداري، رقم 108، حي المحمدية، طريق الأمير سلطان",
      "جدة 23625، المملكة العربية السعودية",
    ],
    link: "https://maps.app.goo.gl/nkSV9rpfAia7FehN8?g_st=ipc",
  },
  {
    icon: Clock,
    title: "ساعات العمل",
    details: ["السبت - الخميس: 8:00 ص - 5:00 م", "الجمعة : مغلق"],
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main id="main-content">
        <PageHeader
          title="تواصل معنا"
          subtitle="نحن هنا للإجابة على جميع استفساراتكم"
          image="/contact-us.webp" // ✅ الصورة الجديدة
        />

        <div className="container mx-auto px-4 py-12">
          <Breadcrumbs
            items={[{ label: "الرئيسية", href: "/" }, { label: "تواصل معنا" }]}
          />

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* 🟢 معلومات التواصل */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  معلومات التواصل
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  يسعدنا تواصلكم معنا. فريقنا جاهز للإجابة على استفساراتكم ومساعدتكم.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="bg-card text-card-foreground rounded-2xl p-6 transition-all duration-200 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-2">{info.title}</h3>
                        <div className="space-y-1">
                          {info.details.map((detail, idx) => (
                          <p
                            key={idx}
                            dir={info.dir || "rtl"} // ✅ استخدام الاتجاه إذا وجد
                            className="text-card-foreground/80"
                            style={{ unicodeBidi: "plaintext" }}
                          >
                            {detail}
                          </p>
                        ))}
                        </div>
                        {/* 🔗 زر عرض الموقع على الخريطة */}
                        {info.link && (
                          <Link
                            href={info.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-accent hover:underline mt-2 text-sm"
                          >
                            <ExternalLink className="h-4 w-4" />
                            عرض الموقع على الخريطة
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 🗺️ خريطة Google المدمجة */}
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-border shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.497115060429!2d39.1491288!3d21.5867531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3cf4cd936f30b%3A0x6b83f9796b7e0045!2z2KfZhNmF2KfYqiDYp9mE2YXZg9iq2KjZitmF!5e0!3m2!1sar!2ssa!4v1731039580000!5m2!1sar!2ssa"
                  width="100%"
                  height="100%"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              {/* 💬 زر واتساب مباشر */}
              <div className="flex justify-center mt-6">
                <a
                  href="https://wa.me/966553311501"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-green-600 text-white font-medium hover:bg-green-700 transition-all duration-200 hover:scale-105 shadow-md"
                >
                  <MessageCircle className="h-5 w-5" />
                  تواصل عبر واتساب
                </a>
              </div>
            </div>

            {/* 📨 نموذج التواصل */}
            <div>
              <div className="bg-card text-card-foreground rounded-3xl p-8 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">أرسل لنا رسالة</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
