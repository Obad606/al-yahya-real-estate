"use client";

import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { AdminLayout as Shell } from "@/components/admin-layout";

/**
 * ملاحظات:
 * - لا نتحقق من الجلسة هنا إطلاقًا (الـ middleware مسؤول).
 * - هذا الملف يلفّ صفحات الإدارة داخل القوالب/المزوّدات + الشريط الجانبي من components/admin-layout.tsx.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Shell>{children}</Shell>
      </LanguageProvider>
    </ThemeProvider>
  );
}
