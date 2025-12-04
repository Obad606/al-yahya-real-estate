"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, Shield, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import type { Admin } from "@/types/admin";

export function AdminsTable({
  initialAdmins,
  currentUserId,
}: {
  initialAdmins: Admin[];
  currentUserId: string;
}) {
  const [admins, setAdmins] = React.useState<Admin[]>(initialAdmins);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function toggleActive(user_id: string, next: boolean) {
    setBusyId(user_id);
    setError(null);
    try {
      const res = await fetch("/api/admin/admins/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, is_active: next }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        setError(data?.error || "فشل التحديث");
      } else {
        setAdmins((list) => list.map((a) => (a.user_id === user_id ? { ...a, is_active: next } : a)));
      }
    } catch {
      setError("خطأ اتصال بالخادم");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteAdmin(user_id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الإداري؟")) return;
    setBusyId(user_id);
    setError(null);
    try {
      const res = await fetch("/api/admin/admins/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        setError(data?.error || "فشل الحذف");
      } else {
        setAdmins((list) => list.filter((a) => a.user_id !== user_id));
      }
    } catch {
      setError("خطأ اتصال بالخادم");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {error ? <div className="p-3 text-destructive bg-destructive/10 text-sm">{error}</div> : null}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 text-right">الاسم</th>
              <th className="px-4 py-3 text-right">البريد</th>
              <th className="px-4 py-3 text-right">الهاتف</th>
              <th className="px-4 py-3 text-right">الدور</th>
              <th className="px-4 py-3 text-right">الحالة</th>
              <th className="px-4 py-3 text-right">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => {
              const isMe = a.user_id === currentUserId;
              return (
                <tr key={a.user_id} className="border-t border-border/60">
                  <td className="px-4 py-3">
                    {a.full_name} {isMe ? <span className="text-xs text-muted-foreground">(هذا أنت)</span> : null}
                  </td>
                  <td className="px-4 py-3">{a.email}</td>
                  <td className="px-4 py-3">{a.phone || "-"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1">
                      {a.role === "super_admin" ? <ShieldCheck className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                      {a.role === "super_admin" ? "مدير عام" : "مدير"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {a.is_active ? (
                      <span className="inline-flex items-center gap-1 text-green-600">مفعل</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-muted-foreground">موقوف</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        disabled={isMe || busyId === a.user_id}
                        title={isMe ? "لا يمكنك إيقاف/تفعيل نفسك" : ""}
                        onClick={() => toggleActive(a.user_id, !a.is_active)}
                      >
                        {busyId === a.user_id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : a.is_active ? (
                          <>
                            <ToggleLeft className="h-4 w-4" /> إيقاف
                          </>
                        ) : (
                          <>
                            <ToggleRight className="h-4 w-4" /> تفعيل
                          </>
                        )}
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-xl"
                        disabled={isMe || busyId === a.user_id}
                        title={isMe ? "لا يمكنك حذف نفسك" : ""}
                        onClick={() => deleteAdmin(a.user_id)}
                      >
                        {busyId === a.user_id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" /> حذف
                          </>
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {admins.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  لا يوجد إداريون بعد.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
