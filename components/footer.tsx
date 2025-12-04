"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, Shield } from "lucide-react"
import { useLanguage } from "./language-provider"
import { cn } from "@/lib/utils"

// ✅ أيقونة TikTok
function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M30 6a10 10 0 0 0 10 10v6.2a16.2 16.2 0 0 1-10-3.4v10.7A9.5 9.5 0 1 1 20.5 20h.1V26a3.5 3.5 0 1 0 3.5 3.5V6h5.9Z"/>
    </svg>
  )
}

// ✅ أيقونة واتساب
function WhatsappIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19.1 17.4c-.3-.2-1.9-.9-2.2-1s-.5-.2-.8.2-.9 1-1.1 1.2-.4.2-.7.1a7.7 7.7 0 0 1-2.3-1.4 8.6 8.6 0 0 1-1.6-2c-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.5s0-.4 0-.5c0-.2-.8-2-1.1-2.7s-.6-.6-.8-.6h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.7 1.1 2.9 2 3.2 4.8 4.6a16.3 16.3 0 0 0 1.6.6 3.8 3.8 0 0 0 1.7.1c.5-.1 1.9-.8 2.1-1.5s.2-1.3.1-1.5-.2-.2-.5-.4zM27.6 4.4A14.9 14.9 0 0 0 4.4 27.6L3 31l3.5-1.3A14.9 14.9 0 1 0 27.6 4.4Zm-2.1 23a12.4 12.4 0 0 1-17.3 0A12.2 12.2 0 0 1 6.4 8.4a12.4 12.4 0 1 1 19.1 19Z"/>
    </svg>
  )
}

const footerLinks = {
  ar: {
    company: {
      title: "الشركة",
      links: [
        { href: "/about", label: "من نحن" },
        { href: "/vision-mission", label: "الرؤية والرسالة" },
        { href: "/values", label: "قيمنا" },
        { href: "/founder", label: "المؤسس" },
        { href: "/governance", label: "الحوكمة" },
      ],
    },
    projects: {
      title: "روابط مهمة",
      links: [
        { href: "/projects", label: "المشاريع" },
        { href: "/investors", label: "المستثمرون" },
        { href: "/media", label: "الإعلام" },
        { href: "/contact", label: "تواصل معنا" },
      ],
    },
    csr: {
      title: "المسؤولية الاجتماعية",
      links: [
        { href: "/csr/vision2030", label: "رؤية 2030" },
        { href: "/csr/community", label: "خدمة المجتمع" },
      ],
    },
    contact: {
      title: "تواصل معنا",
      info: [
        { icon: Phone, text: "+966537916000" },
        { icon: Mail, text: "Alyahya.mhmd4@gmail.com" },
        { icon: MapPin, text: "جدة، المملكة العربية السعودية" },
      ],
    },
  },
  en: {},
} as const

export function Footer() {
  const { language } = useLanguage()
  const content = footerLinks[language as "ar"] || footerLinks.ar
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card text-card-foreground mt-24">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-accent">{content.company.title}</h3>
            <ul className="space-y-3">
              {content.company.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-card-foreground/80 hover:text-accent transition-colors duration-150 text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-accent">{content.projects.title}</h3>
            <ul className="space-y-3">
              {content.projects.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-card-foreground/80 hover:text-accent transition-colors duration-150 text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CSR */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-accent">{content.csr.title}</h3>
            <ul className="space-y-3">
              {content.csr.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-card-foreground/80 hover:text-accent transition-colors duration-150 text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Social */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-accent">{content.contact.title}</h3>
            <ul className="space-y-4">
              {content.contact.info.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <item.icon className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-card-foreground/80 text-sm">{item.text}</span>
                </li>
              ))}
            </ul>

            {/* TikTok + WhatsApp */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.tiktok.com/@dyaarcom?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className={cn(
                  "h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center",
                  "text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-150 hover:scale-110"
                )}
              >
                <TikTokIcon className="h-5 w-5" />
              </a>

              <a
                href="https://www.tiktok.com/link/v2?aid=1988&lang=en&scene=bio_url&target=https%3A%2F%2Fwa.me%2F966553311501"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className={cn(
                  "h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center",
                  "text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-150 hover:scale-110"
                )}
              >
                <WhatsappIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-card-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-card-foreground/60">
            <p>© {currentYear} مؤسسة محمد سليمان اليحيا للتطوير العقاري. جميع الحقوق محفوظة.</p>

            <Link
              href="/admin/login"
              aria-label="واجهة المدير"
              className={cn(
                "h-9 w-9 rounded-full bg-muted/60 hover:bg-accent hover:text-accent-foreground",
                "flex items-center justify-center transition-all duration-150 hover:scale-110"
              )}
              title="تسجيل دخول المدير"
            >
              <Shield className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
