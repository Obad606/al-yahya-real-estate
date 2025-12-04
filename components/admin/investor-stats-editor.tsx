"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type FormState = {
  housing_area_sqm: number;
  housing_units: number;
  total_sales: number;
  total_acquisitions: number;
};

export default function InvestorStatsEditor() {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<FormState>({
    housing_area_sqm: 0,
    housing_units: 0,
    total_sales: 0,
    total_acquisitions: 0,
  });

  // حمّل البيانات مع خيار للحفاظ على رسالة النجاح
  async function load(options?: { preserveOk?: boolean }) {
    const preserveOk = options?.preserveOk === true;

    setError(null);
    if (!preserveOk) setOk(null);   // ← لا نمسح رسالة النجاح إذا كنا جايين من save()
    setBusy(true);

    try {
      const res = await fetch("/api/public/investor-stats", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "فشل جلب بيانات المستثمرين");
      }

      setForm({
        housing_area_sqm: Number(data.residential_area_sqm ?? 0),
        housing_units: Number(data.housing_units ?? 0),
        total_sales: Number(data.total_sales ?? 0),
        total_acquisitions: Number(data.total_acquisitions ?? 0),
      });
    } catch (e: any) {
      setError(e?.message || "فشل جلب بيانات المستثمرين");
    } finally {
      setBusy(false);
    }
  }

  React.useEffect(() => {
    load(); // التحميل الأول الطبيعي: يمسح ok
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setBusy(true);

    try {
      const res = await fetch("/api/admin/investor-stats/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          residential_area_sqm: form.housing_area_sqm,
          housing_units: form.housing_units,
          total_sales: form.total_sales,
          total_acquisitions: form.total_acquisitions,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "فشل الحفظ");
      }

      setOk("تم الحفظ بنجاح");
      // نحافظ على رسالة النجاح أثناء إعادة التحميل
      await load({ preserveOk: true });
      // اختياري: اخفِ الرسالة بعد ثوانٍ
      // setTimeout(() => setOk(null), 2500);
    } catch (e: any) {
      setError(e?.message || "خطأ اتصال بالخادم");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <h2 className="text-lg font-semibold">إحصائيات المستثمرين</h2>
      {error ? <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-xl">{error}</div> : null}
      {ok ? <div className="text-sm text-green-600 bg-green-600/10 p-3 rounded-xl">{ok}</div> : null}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label>المساحة السكنية (م²)</Label>
          <Input
            type="number"
            min={0}
            value={form.housing_area_sqm}
            onChange={(e) => setForm((p) => ({ ...p, housing_area_sqm: Number(e.target.value) || 0 }))}
          />
        </div>
        <div>
          <Label>عدد الوحدات السكنية</Label>
          <Input
            type="number"
            min={0}
            value={form.housing_units}
            onChange={(e) => setForm((p) => ({ ...p, housing_units: Number(e.target.value) || 0 }))}
          />
        </div>
        <div>
          <Label>إجمالي المبيعات (ريال)</Label>
          <Input
            type="number"
            min={0}
            value={form.total_sales}
            onChange={(e) => setForm((p) => ({ ...p, total_sales: Number(e.target.value) || 0 }))}
          />
        </div>
        <div>
          <Label>إجمالي الاستحواذات (ريال)</Label>
          <Input
            type="number"
            min={0}
            value={form.total_acquisitions}
            onChange={(e) => setForm((p) => ({ ...p, total_acquisitions: Number(e.target.value) || 0 }))}
          />
        </div>
      </div>

      <Button disabled={busy} className="rounded-2xl">
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" /> جاري الحفظ...
          </>
        ) : (
          "حفظ"
        )}
      </Button>
    </form>
  );
}
