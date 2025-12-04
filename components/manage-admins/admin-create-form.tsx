// C:\Users\Dell\Downloads\code\components\manage-admins\admin-create-form.tsx
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";

export function AdminCreateForm() {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({
    full_name: "",
    email: "",
    phone: "",
    role: "admin",
    password: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setOk(null);

    try {
      const res = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        setError(data?.error || "فشل إنشاء الإداري");
      } else {
        setOk("تم إنشاء الإداري بنجاح");
        setForm({ full_name: "", email: "", phone: "", role: "admin", password: "" });
        // يُفضّل إعادة تحميل الصفحة لعرض المُستجدات
        setTimeout(() => {
          window.location.reload();
        }, 400);
      }
    } catch (e: any) {
      setError("خطأ اتصال بالخادم");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border p-6 bg-card space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Plus className="h-5 w-5" /> إضافة إداري جديد
      </h2>

      {error ? <div className="text-destructive bg-destructive/10 p-3 rounded-xl text-sm">{error}</div> : null}
      {ok ? <div className="text-green-600 bg-green-600/10 p-3 rounded-xl text-sm">{ok}</div> : null}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>الاسم الكامل</Label>
          <Input
            value={form.full_name}
            onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label>البريد الإلكتروني</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <Label>رقم الهاتف</Label>
          <Input
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
        </div>
        <div>
          <Label>الدور</Label>
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={form.role}
            onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
          >
            <option value="admin">مدير</option>
            <option value="super_admin">مدير عام</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label>كلمة المرور المؤقتة</Label>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            required
            autoComplete="new-password"
          />
        </div>
      </div>

      <Button disabled={busy} className="rounded-2xl">
        {busy ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> جاري الإنشاء...</> : "إنشاء"}
      </Button>
    </form>
  );
}
