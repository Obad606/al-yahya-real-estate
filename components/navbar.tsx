"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useLanguage } from "./language-provider";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

// ✅ تعريف نوع العنصر
interface NavItem {
  href: string;
  label: string;
}

// ✅ تعريف القوائم
const navItems: Record<"ar" | "en", NavItem[]> = {
  ar: [
    { href: "/", label: "الرئيسية" },
    { href: "/about", label: "من نحن" },
    { href: "/projects", label: "المشاريع" },
    { href: "/investors", label: "المستثمرون" },
    { href: "/csr/vision2030", label: "المسؤولية الاجتماعية" },
    { href: "/media", label: "الإعلام" },
    { href: "/contact", label: "تواصل معنا" },
  ],
  en: [],
};

export function Navbar() {
  const pathname = usePathname();

  // 🌓 الثيم الآمن
  const safeTheme = (() => {
    try {
      return useTheme();
    } catch {
      return { theme: "light" as const, toggleTheme: () => {} };
    }
  })();

  const { theme, toggleTheme } = safeTheme;
  const { language } = useLanguage();
  const items: NavItem[] = navItems[language] || navItems.ar;

  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-md"
          : "bg-background"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* 🏢 الشعار + اسم المؤسسة */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="شعار مؤسسة محمد سليمان اليحيا للتطوير العقاري"
              width={48}
              height={48}
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <div className="text-xl sm:text-2xl font-bold text-foreground transition-colors duration-200 group-hover:text-accent">
              اليحيا للتطوير العقاري
            </div>
          </Link>

          {/* 💻 قائمة سطح المكتب */}
          <div className="hidden lg:flex items-center gap-1">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors duration-150",
                    "hover:text-accent",
                    isActive ? "text-accent" : "text-foreground"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent animate-in slide-in-from-left duration-200" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* 🌙☀️ أزرار الإجراءات */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={
                theme === "light" ? "تفعيل الوضع الليلي" : "تفعيل الوضع النهاري"
              }
              className="rounded-full"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {/* 📱 زر القائمة للموبايل */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden rounded-full"
              aria-label="القائمة"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* 📱 قائمة الموبايل */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-2">
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-4 py-3 text-base font-medium rounded-2xl transition-colors duration-150",
                      isActive
                        ? "bg-accent/10 text-accent"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
