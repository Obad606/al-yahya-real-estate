"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function StatsEditor() {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({
    years_experience: 0,
    awards_count: 0,
    clients_count: 0,
    projects_completed: 0, // للعرض فقط (يُحتسب من المشاريع)
  });

  async function load() {
    try {
      setBusy(true);
      const res = await fetch("/api/public/stats", { cache: "no-store" });
      const data = await res.json();
      setForm({
        years_experience: data?.years_experience ?? 0,
        awards_count: data?.awards_count ?? 0,
        clients_count: data?.clients_count ?? 0,
        projects_completed: data?.projects_completed ?? 0,
      });
    } catch {
      setError("فشل جلب الإحصائيات");
    } finally {
      setBusy(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/stats/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          years_experience: form.years_experience,
          awards_count: form.awards_count,
          clients_count: form.clients_count,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        setError(data?.error || "فشل الحفظ");
      } else {
        setOk("تم الحفظ بنجاح");
        load();
      }
    } catch {
      setError("خطأ اتصال بالخادم");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <h2 className="text-lg font-semibold">إحصائيات الموقع</h2>
      {error ? <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-xl">{error}</div> : null}
      {ok ? <div className="text-sm text-green-600 bg-green-600/10 p-3 rounded-xl">{ok}</div> : null}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label>سنوات الخبرة</Label>
          <Input
            type="number"
            min={0}
            value={form.years_experience}
            onChange={(e) => setForm((p) => ({ ...p, years_experience: +e.target.value }))}
          />
        </div>
        <div>
          <Label>جوائز وتكريم</Label>
          <Input
            type="number"
            min={0}
            value={form.awards_count}
            onChange={(e) => setForm((p) => ({ ...p, awards_count: +e.target.value }))}
          />
        </div>
        <div>
          <Label>عملاء راضون</Label>
          <Input
            type="number"
            min={0}
            value={form.clients_count}
            onChange={(e) => setForm((p) => ({ ...p, clients_count: +e.target.value }))}
          />
        </div>
        <div>
          <Label>المشاريع المكتملة (محسوبة)</Label>
          <Input type="number" value={form.projects_completed} disabled />
        </div>
      </div>

      <Button disabled={busy} className="rounded-2xl">
        {busy ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> جاري الحفظ...</> : "حفظ"}
      </Button>
    </form>
  );
}
