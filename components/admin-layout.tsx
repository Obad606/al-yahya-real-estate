// C:\Users\Dell\Downloads\code\components\admin-layout.tsx
"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  LayoutDashboard,
  FolderKanban,
  ImageIcon,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/manage-projects", label: "إدارة المشاريع", icon: FolderKanban },
  { href: "/admin/manage-media", label: "إدارة الوسائط", icon: ImageIcon },
  { href: "/admin/manage-contact", label: "الرسائل", icon: MessageSquare },
];

// حارس ضد التغليف المزدوج
const AdminLayoutContext = React.createContext<boolean>(false);

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isNested = React.useContext(AdminLayoutContext);

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false); // للجوال
  const [desktopReveal, setDesktopReveal] = React.useState(false); // حركة دخول السايدبار

  const isLogin = pathname === "/admin/login";

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {}
    router.replace("/admin/login");
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // ✅ جميع الـ hooks تُستدعى دومًا، بدون أي return مبكر:
  React.useEffect(() => {
    // إغلاق القائمة الجوالية عند تغيّر المسار
    setIsSidebarOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    // حركة دخول السايدبار لسطح المكتب عند التحميل
    const t = setTimeout(() => setDesktopReveal(true), 0);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    // إغلاق Drawer الجوال عند الضغط على Esc
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSidebarOpen(false);
    };
    if (isSidebarOpen) {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [isSidebarOpen]);

  // إن كان التغليف مزدوجًا، نُظهر الأطفال فقط داخل Provider لمنع اختلاف شجرة الـ hooks
  if (isNested) {
    return (
      <AdminLayoutContext.Provider value={true}>
        {children}
      </AdminLayoutContext.Provider>
    );
  }

  return (
    <AdminLayoutContext.Provider value={true}>
      {/* إذا كنا في صفحة تسجيل الدخول، لا نعرض السايدبار/الهيدر، فقط الأطفال */}
      {isLogin ? (
        <>{children}</>
      ) : (
        <div className="min-h-screen bg-background">
          {/* رأس الجوال */}
          <div className="lg:hidden sticky top-0 z-50 bg-card border-b border-border px-4">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-xl font-bold text-card-foreground">لوحة الإدارة</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen((s) => !s)}
                className="rounded-full"
                aria-label={isSidebarOpen ? "إغلاق القائمة" : "فتح القائمة"}
                aria-expanded={isSidebarOpen}
                aria-controls="admin-mobile-drawer"
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Drawer الجوال + Overlay */}
          {isSidebarOpen && (
            <>
              <div
                className="lg:hidden fixed inset-0 z-40 bg-black/40 animate-in fade-in-0"
                onClick={() => setIsSidebarOpen(false)}
                aria-hidden="true"
              />
              <aside
                id="admin-mobile-drawer"
                role="dialog"
                aria-modal="true"
                className={cn(
                  "lg:hidden fixed top-0 right-0 z-50 h-full w-80 bg-card border-l border-border shadow-xl",
                  "data-[state=open]:animate-in data-[state=closed]:animate-out",
                  "transition-transform duration-300 ease-in-out",
                  "translate-x-0"
                )}
              >
                <div className="flex items-center justify-between px-4 h-16 border-b border-border">
                  <span className="text-lg font-bold">اليحيا — الإدارة</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(false)}
                    className="rounded-full"
                    aria-label="إغلاق"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                <nav className="p-4 space-y-2">
                  {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors duration-150",
                          active
                            ? "bg-accent text-accent-foreground"
                            : "text-card-foreground hover:bg-muted"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-2xl text-destructive hover:bg-destructive/10 mt-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    تسجيل الخروج
                  </Button>
                </nav>
              </aside>
            </>
          )}

          <div className="flex">
            {/* سايدبار سطح المكتب */}
            <aside
              className={cn(
                "hidden lg:flex lg:flex-col lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:bg-card lg:border-l lg:border-border",
                "transition-all duration-500 ease-out transform",
                desktopReveal ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6",
                "lg:shadow-md"
              )}
            >
              <div className="flex flex-col h-full p-6 overflow-y-auto">
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-card-foreground">اليحيا</h1>
                  <p className="text-sm text-card-foreground/60">لوحة الإدارة</p>
                </div>

                <nav className="flex-1 space-y-2">
                  {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors duration-150",
                          active
                            ? "bg-accent text-accent-foreground"
                            : "text-card-foreground hover:bg-muted"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-2xl text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  تسجيل الخروج
                </Button>
              </div>
            </aside>

            {/* المحتوى */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
          </div>
        </div>
      )}
    </AdminLayoutContext.Provider>
  );
}

export default AdminLayout;
