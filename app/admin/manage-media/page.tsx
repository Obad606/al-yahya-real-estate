"use client";

import * as React from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Upload, Trash2, Loader2, Pencil } from "lucide-react";

type Media = {
  id: string;
  type: string;
  title: string;
  excerpt: string | null;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  pdf_url: string | null;
  created_at: string;
};

export default function ManageMediaPage() {
  const [mediaList, setMediaList] = React.useState<Media[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    type: "news",
    title: "",
    excerpt: "",
    description: "",
    image_url: "",
    video_url: "",
    pdf_url: "",
  });

  // جلب الوسائط
  const fetchMedia = React.useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/media", { cache: "no-store" });
    const json = await res.json();
    if (json?.success && Array.isArray(json.data)) setMediaList(json.data);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // رفع ملف
  const uploadFile = async (file: File, folder: "images" | "videos" | "pdfs") => {
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok && json?.url) return json.url as string;
      alert(json?.error || "فشل رفع الملف");
      return null;
    } catch (e: any) {
      alert("حدث خطأ أثناء الرفع: " + e.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // تعبئة النموذج من سجل موجود (وضع التعديل)
  const startEdit = (m: Media) => {
    setEditingId(m.id);
    setForm({
      type: m.type || "news",
      title: m.title || "",
      excerpt: m.excerpt || "",
      description: m.description || "",
      image_url: m.image_url || "",
      video_url: m.video_url || "",
      pdf_url: m.pdf_url || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      type: "news",
      title: "",
      excerpt: "",
      description: "",
      image_url: "",
      video_url: "",
      pdf_url: "",
    });
  };

  // حفظ (إنشاء أو تعديل)
  const saveMedia = async () => {
    if (!form.title.trim()) return alert("العنوان مطلوب");
    if (uploading) return alert("يرجى انتظار انتهاء الرفع");

    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/media/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const json = await res.json();
        if (!res.ok || !json?.success) {
          alert(json?.error || "فشل التعديل");
        } else {
          alert("تم تعديل الوسائط");
          resetForm();
          fetchMedia();
        }
      } else {
        const res = await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const json = await res.json();
        if (!res.ok || !json?.success) {
          alert(json?.error || "فشل الحفظ");
        } else {
          alert("تم الحفظ بنجاح");
          resetForm();
          fetchMedia();
        }
      }
    } finally {
      setSaving(false);
    }
  };

  // حذف
  const deleteMedia = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (res.ok && json?.success) {
      if (editingId === id) resetForm();
      fetchMedia();
    } else {
      alert(json?.error || "فشل الحذف");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">إدارة الوسائط</h1>
            <p className="text-sm text-muted-foreground">إضافة وتعديل وحذف الوسائط الإعلامية</p>
          </div>
        </div>

        {/* النموذج */}
        <div className="bg-card p-6 rounded-2xl border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editingId ? "تعديل الوسائط" : "إضافة وسائط جديدة"}
            </h2>
            {editingId ? (
              <Button variant="outline" onClick={resetForm} className="rounded-xl">
                إلغاء التعديل
              </Button>
            ) : null}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              value={form.type}
              onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}
            >
              <SelectTrigger><SelectValue placeholder="النوع" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="news">خبر</SelectItem>
                <SelectItem value="event">فعالية</SelectItem>
                <SelectItem value="press">بيان صحفي</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="العنوان"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />

            <Input
              placeholder="رابط الصورة (اختياري)"
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
            />
            <label className="flex items-center gap-2 border px-3 py-2 rounded-md cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>رفع صورة</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    const url = await uploadFile(f, "images");
                    if (url) setForm((p) => ({ ...p, image_url: url }));
                  }
                }}
              />
            </label>

            <Input
              placeholder="رابط الفيديو (اختياري)"
              value={form.video_url}
              onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
            />
            <label className="flex items-center gap-2 border px-3 py-2 rounded-md cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>رفع فيديو</span>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    const url = await uploadFile(f, "videos");
                    if (url) setForm((p) => ({ ...p, video_url: url }));
                  }
                }}
              />
            </label>

            <Input
              placeholder="رابط PDF (اختياري)"
              value={form.pdf_url}
              onChange={(e) => setForm((f) => ({ ...f, pdf_url: e.target.value }))}
            />
            <label className="flex items-center gap-2 border px-3 py-2 rounded-md cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>رفع PDF</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    const url = await uploadFile(f, "pdfs");
                    if (url) setForm((p) => ({ ...p, pdf_url: url }));
                  }
                }}
              />
            </label>
          </div>

          <Textarea
            placeholder="الوصف المختصر"
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          />
          <Textarea
            placeholder="الوصف الكامل"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />

          <Button onClick={saveMedia} disabled={saving || uploading} className="rounded-xl">
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {editingId ? "حفظ التعديلات" : "حفظ الوسائط"}
          </Button>
        </div>

        {/* قائمة الوسائط */}
        {loading ? (
          <p>جاري التحميل...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaList.map((m) => (
              <div key={m.id} className="bg-card rounded-2xl border p-4">
                <div className="aspect-[16/9] bg-muted mb-2 rounded-md overflow-hidden">
                  {m.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.image_url} alt={m.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                      لا توجد صورة
                    </div>
                  )}
                </div>
                <h3 className="font-semibold">{m.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{m.type}</p>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{m.excerpt}</p>

                <div className="flex justify-between items-center mt-3 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl gap-1"
                    onClick={() => startEdit(m)}
                  >
                    <Pencil className="h-4 w-4" /> تعديل
                  </Button>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => deleteMedia(m.id)}
                    className="rounded-full"
                    title="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {mediaList.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-10">
                لا توجد وسائط بعد.
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
