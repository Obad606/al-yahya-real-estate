"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar"; // ✅ تمت الإضافة هنا
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirectTo = sp.get("redirectTo") || "/admin/dashboard";

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({ email: "", password: "" });
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const res = await fetch("/api/admin/me", { cache: "no-store" });
        if (!cancelled && res.ok) {
          const data = await res.json();
          if (data?.authenticated) {
            router.replace(redirectTo);
          }
        }
      } catch {}
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setError(data?.error || "فشل تسجيل الدخول");
        setIsSubmitting(false);
        return;
      }

      router.replace(redirectTo);
    } catch (err) {
      console.error("Login Error:", err);
      setError("حدث خطأ أثناء الاتصال بالخادم");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ✅ Navbar في الأعلى */}
      <Navbar />

      {/* ✅ محتوى تسجيل الدخول */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* شعار */}
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">لوحة الإدارة</h1>
            <p className="text-muted-foreground">تسجيل الدخول إلى نظام الإدارة</p>
          </div>

          {/* النموذج */}
          <div className="bg-card text-card-foreground rounded-3xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 text-destructive rounded-2xl p-4 text-sm">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                  className="mt-2 rounded-2xl"
                  placeholder="admin@example.com"
                  disabled={isSubmitting}
                  autoComplete="username"
                />
              </div>

              <div>
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, password: e.target.value }))
                  }
                  className="mt-2 rounded-2xl"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin ml-2" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </form>
          </div>

          {/* العودة */}
          <div className="mt-6 text-center">
            <a href="/" className="text-accent hover:underline text-sm">
              العودة إلى الموقع الرئيسي
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
