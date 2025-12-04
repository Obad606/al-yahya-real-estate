import type React from "react"
import type { Metadata } from "next"
import { Cairo, Tajawal, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider" // تبقى لكن اللغة مقفولة على العربية

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
})

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "مؤسسة اليحيا للتطوير العقاري | Al-Yahya Real Estate Development",
  description:
    "مؤسسة رائدة في التطوير العقاري بالمملكة العربية السعودية | Leading real estate development company in Saudi Arabia",
  generator: "v0.app",
  keywords: ["عقارات", "تطوير عقاري", "السعودية", "real estate", "development", "Saudi Arabia"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} ${tajawal.variable} ${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          {/* LanguageProvider مقفول على ar/rtl داخليًا */}
          <LanguageProvider>
            <a href="#main-content" className="skip-to-content">
              انتقل إلى المحتوى الرئيسي
            </a>
            {children}
            <Analytics />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
